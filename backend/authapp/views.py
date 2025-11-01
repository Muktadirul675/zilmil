from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import login, logout
from .serializers import RegisterSerializer, LoginSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserWithGroupsSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth.models import Group
from .utils import get_user_activity
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from authapp.permissions import OnlyAdmin
from django.core.cache import cache
from .utils import broadcast_logout

User = get_user_model()

class UserLockView(APIView):
    permission_classes = [OnlyAdmin]

    def post(self, request, user_id):
        """
        Lock a user
        """
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        key = f"user:{user.id}:lock"
        cache.set(key, True, timeout=None)  # No expiration
        broadcast_logout(user.id)
        return Response({"detail": f"User {user.username} is locked."})

    def delete(self, request, user_id):
        """
        Unlock a user
        """
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        key = f"user:{user.id}:lock"
        cache.delete(key)
        return Response({"detail": f"User {user.username} is unlocked."})

class ForceLogoutView(APIView):
    permission_classes = [OnlyAdmin]  # Only admins can force logout

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Blacklist all outstanding tokens for the user
        tokens = OutstandingToken.objects.filter(user=user)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)
        broadcast_logout(user.id)
        return Response({"detail": f"All tokens for user {user.username} have been blacklisted."})
    
class LogoutAllView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        tokens = OutstandingToken.objects.filter(user=user)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)
        broadcast_logout(user.id)
        return Response({"detail": "Logged out from all devices."}, status=status.HTTP_205_RESET_CONTENT)

# -------------------------
# Custom Token Obtain View
# -------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        allowed_groups = ['Admin', 'Staff']
        key = f'user:{user.id}:lock'
        locked = cache.get(key)
        # Only allow users in Admin/Staff groups or superuser
        if not (user.is_superuser or user.groups.filter(name__in=allowed_groups).exists()) or locked:
            raise PermissionDenied("You do not have permission to log in.")

        # Optional: include extra info in token response
        data['groups'] = list(user.groups.values_list('name', flat=True))
        data['username'] = user.username
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# -------------------------
# Custom Token Refresh View
# -------------------------
class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Decode refresh token
        refresh = RefreshToken(attrs['refresh'])
        user = None
        # Try to get user from request
        if self.context['request'].user.is_authenticated:
            user = self.context['request'].user
        else:
            # Fallback: get user from token payload
            if 'user_id' in refresh.payload:
                try:
                    user = User.objects.get(id=refresh.payload['user_id'])
                except User.DoesNotExist:
                    raise InvalidToken("User no longer exists.")

        key = f'user:{user.id}:lock'
        locked = cache.get(key)
        # Check group permissions
        allowed_groups = ['Admin', 'Staff']
        if not (user.is_superuser or user.groups.filter(name__in=allowed_groups).exists()) or locked:
            raise PermissionDenied("You do not have permission to refresh this token.")

        return data


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer
    
@api_view(["GET"])
@permission_classes([OnlyAdmin])
def active_users_view(request):
    data = get_user_activity()
    return Response(data)

class MakeStaffView(APIView):
    permission_classes = [OnlyAdmin]
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            staff_group, created = Group.objects.get_or_create(name='Staff')
            user.groups.add(staff_group)
            return Response({"message": f"{user.username} is now a staff."})
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class RemoveStaffView(APIView):
    permission_classes = [OnlyAdmin]
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            staff_group = Group.objects.get(name='Staff')
            user.groups.remove(staff_group)
            return Response({"message": f"{user.username} is no longer a staff."})
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Group.DoesNotExist:
            return Response({"error": "Staff group not found."}, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserWithGroupsSerializer(request.user)
        return Response(serializer.data)

class UserListWithGroupsView(APIView):
    # Optional: restrict to admin
    # permission_classes = [IsAdminUser]view
    permission_classes = [OnlyAdmin]
    def get(self, request):
        users = User.objects.prefetch_related('groups').all()
        serializer = UserWithGroupsSerializer(users, many=True)
        return Response(serializer.data)
    
@ensure_csrf_cookie
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
@api_view(['GET'])
def csrf_token_view(request):
    return Response({"message": "CSRF cookie set"})

class RegisterView(APIView):
    permission_classes = [OnlyAdmin]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered"}, status=201)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            user_data = UserWithGroupsSerializer(user).data
            return Response({
                "message": "Logged in successfully",
                "user": user_data
            })
        return Response(serializer.errors, status=400)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out"})

class UserRolesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roles = request.user.groups.values_list('name', flat=True)
        return Response({"roles": list(roles)})
    
class ChangeUserPassword(APIView):
    permission_classes = [OnlyAdmin]

    def post(self, request):
        user_id = request.query_params.get('user_id')
        new_password = request.data.get('new_password')

        if not user_id or not new_password:
            return Response(
                {"detail": "user_id and new_password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Set new password directly
        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

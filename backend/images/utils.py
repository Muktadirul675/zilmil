from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

def compress_image(image_file, format='WEBP', quality=80):
    image = Image.open(image_file)
    image_io = BytesIO()
    image.save(image_io, format=format, quality=quality, optimize=True)
    new_image_file = ContentFile(image_io.getvalue(), name=image_file.name.rsplit('.', 1)[0] + '.webp')
    return new_image_file
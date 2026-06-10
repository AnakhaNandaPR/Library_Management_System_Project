import os
import dj_database_url
from .settings import *
#ALLOWED_HOSTS=[os.environ.get('RENDER_EXTERNAL_HOSTNAME')]
ALLOWED_HOSTS=['.onrender.com']
CSRF_TRUSTED_ORIGINS=['https://*.onrender.com']
#CSRF_TRUSTED_ORIGINS='https://'+os.environ.get['RENDER_EXTERNAL_HOSTNAME']
DEBUG=False
SECRET_KEY=os.environ.get('SECRET_KEY')
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
STATIC_URL='/static/'
STATIC_ROOT=os.path.join(BASE_DIR,'staticfiles')

STORAGES={
    'default':
    {
        "BACKEND":"django.core.files.storage.FileSystemStorage",
    },
    "staticfiles":{
        "BACKEND":"whitenoise.storage.CompressedManifestStaticFilesStorage",
    }
}

DATABASES={
    'default':dj_database_url.config(
        default=os.environ['DATABASE_URL'],conn_max_age=600
    )
}
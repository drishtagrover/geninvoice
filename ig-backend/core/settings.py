import os
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG      = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.postgres",          

    # third party
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist", 
    "corsheaders",

    # local apps
    "users",
    "invoices",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",    
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE":   "django.db.backends.postgresql",
        "NAME":     os.getenv("DB_NAME"),
        "USER":     os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST":     os.getenv("DB_HOST", "localhost"),
        "PORT":     os.getenv("DB_PORT", "5432"),
        "OPTIONS": {
            "connect_timeout": 10,
        },
    }
}

AUTH_USER_MODEL = "users.User"  

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",  
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",      
    ],
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":        timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME":       timedelta(days=7),
    "ROTATE_REFRESH_TOKENS":        True,   # every refresh issues a new refresh token
    "BLACKLIST_AFTER_ROTATION":     True,   # old refresh token is blacklisted immediately
    "UPDATE_LAST_LOGIN":            True,   # stamp last_login on token refresh

    "ALGORITHM":                    "HS256",
    "SIGNING_KEY":                  os.getenv("JWT_SECRET_KEY"),

    "AUTH_HEADER_TYPES":            ("Bearer",),
    "USER_ID_FIELD":                "id",
    "USER_ID_CLAIM":                "user_id",

    "TOKEN_OBTAIN_SERIALIZER":      "users.serializers.CustomTokenObtainPairSerializer",
}


CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
CORS_ALLOW_CREDENTIALS = True   # allow cookies/auth headers cross-origin

# Email — default to console backend for local dev
EMAIL_BACKEND       = os.getenv("EMAIL_BACKEND",       "django.core.mail.backends.console.EmailBackend")
EMAIL_HOST          = os.getenv("EMAIL_HOST",          "")
EMAIL_PORT          = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS       = os.getenv("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER     = os.getenv("EMAIL_HOST_USER",     "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL  = os.getenv("DEFAULT_FROM_EMAIL",  "noreply@geninvoice.com")



LANGUAGE_CODE = "en-us"
TIME_ZONE     = "UTC"
USE_I18N      = True
USE_TZ        = True            

STATIC_URL  = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
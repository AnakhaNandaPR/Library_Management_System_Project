#set -o errexit
pip install -r requirements.txt
python mainproject/manage.py collectstatic --no-input
python mainproject/manage.py migrate
python mainproject/manage.py createsuperuser --noinput --username admin --email admin@example.com || true
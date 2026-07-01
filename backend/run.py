import os
from app import create_app

os.environ["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local_development.db"

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
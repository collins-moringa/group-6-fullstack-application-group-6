from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import db, migrate, ma


def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)
    app.url_map.strict_slashes = False

    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # Import models so Flask-Migrate can detect them for `flask db migrate`
    from app.models.country import Country  # noqa: F401
    from app.models.favorite import Favorite  # noqa: F401

    from .routes.country_routes import country_bp
    from .routes.favorite_routes import favorite_bp
    from .routes.who_routes import who_bp

    app.register_blueprint(country_bp, url_prefix="/countries")
    app.register_blueprint(favorite_bp, url_prefix="/favorites")
    app.register_blueprint(who_bp, url_prefix="/who-data")

    return app
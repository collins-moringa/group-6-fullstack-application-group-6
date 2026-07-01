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
    from app.models.user import User  # noqa: F401
    from app.models.indicator import Indicator  # noqa: F401
    from app.models.data_point import DataPoint  # noqa: F401

    from .routes.country_routes import country_bp
    from .routes.favorite_routes import favorite_bp
    from .routes.indicator_routes import indicator_bp
    from .routes.data_point_routes import data_point_bp
    from .routes.auth_routes import auth_bp
    from .routes.admin_routes import admin_bp

    app.register_blueprint(country_bp, url_prefix="/countries")
    app.register_blueprint(favorite_bp, url_prefix="/favorites")
    app.register_blueprint(indicator_bp, url_prefix="/indicators")
    app.register_blueprint(data_point_bp, url_prefix="/data-points")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    return app
import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///local_development.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
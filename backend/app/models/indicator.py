from app.extensions import db


class Indicator(db.Model):
    __tablename__ = "indicators"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    unit = db.Column(db.String(50), nullable=True)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "unit": self.unit,
            "description": self.description,
            "IndicatorCode": self.code,   # alias for frontend compatibility
            "IndicatorName": self.name,   # alias for frontend compatibility
        }

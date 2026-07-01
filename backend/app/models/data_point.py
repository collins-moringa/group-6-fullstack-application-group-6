from app.extensions import db


class DataPoint(db.Model):
    __tablename__ = "data_points"
    __table_args__ = (
        db.UniqueConstraint("country_id", "indicator_id", "year", name="uq_data_point_country_indicator_year"),
    )

    id = db.Column(db.Integer, primary_key=True)
    country_id = db.Column(db.Integer, db.ForeignKey("countries.id"), nullable=False)
    indicator_id = db.Column(db.Integer, db.ForeignKey("indicators.id"), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    value = db.Column(db.Float, nullable=False)

    country = db.relationship("Country", backref=db.backref("data_points", lazy=True))
    indicator = db.relationship("Indicator", backref=db.backref("data_points", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "country_id": self.country_id,
            "indicator_id": self.indicator_id,
            "year": self.year,
            "value": self.value,
            "country_name": self.country.name if self.country else None,
            "country_code": self.country.iso_code if self.country else None,
            "indicator_code": self.indicator.code if self.indicator else None,
            "indicator_name": self.indicator.name if self.indicator else None,
            # WHO-row-compatible aliases so the frontend's existing chart/stat-card
            # parsing (TimeDim/NumericValue) works unchanged.
            "TimeDim": self.year,
            "NumericValue": self.value,
        }

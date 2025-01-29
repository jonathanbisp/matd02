import datetime
from typing import List, Optional

from sqlalchemy import TIMESTAMP, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.models.base import Base


class Baseline(Base):
    __tablename__ = "baselines"
    id: Mapped[int] = mapped_column(primary_key=True)
    id_course: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), nullable=False)
    reference_period: Mapped[str] = mapped_column(String(25), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP,
        default=datetime.datetime.now(tz=datetime.timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP,
        onupdate=datetime.datetime.now(tz=datetime.timezone.utc),
        nullable=False,
    )
    
    baselines = relationship("Baseline", back_populates="course", cascade="all, delete-orphan")
    users = relationship("User", back_populates="course", cascade="all")
    categories = relationship("Category", back_populates="course", cascade="all")

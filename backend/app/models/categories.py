import datetime
from typing import List, Optional

from sqlalchemy import TIMESTAMP, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.models.base import Base


class Category(Base):
    __tablename__ = "categories"
    id: Mapped[int] = mapped_column(primary_key=True)
    baseline_id = mapped_column(Integer, ForeignKey("baselines.id"), nullable=False)
    minimal_hours: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(2048), nullable=False)

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

    baseline = relationship("Baseline", back_populates="categories")
    subcategories = relationship("Subcategories", back_populates="category", cascade="all, delete-orphan")
    activity_registers = relationship(
        "ActivityRegister", back_populates="category", cascade="all, delete-orphan"
    )

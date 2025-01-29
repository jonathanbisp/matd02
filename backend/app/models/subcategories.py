import datetime
from typing import List, Optional

from sqlalchemy import ForeignKey, String, Integer, TIMESTAMP
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.models.base import Base


class Subcategory(Base):
    __tablename__ = "subcategories"
    id: Mapped[int] = mapped_column(primary_key=True)
    category_id = mapped_column(Integer, ForeignKey("categories.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(2048), nullable=False)
    hours_limit: Mapped[int] = mapped_column(Integer, nullable=True)

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

    category = relationship("Category", back_populates="subcategories")
    activities = relationship("Activity", back_populates="subcategory", cascade="all, delete-orphan")
    activity_registers = relationship(
        "ActivityRegister", back_populates="subcategory", cascade="all, delete-orphan"
    )

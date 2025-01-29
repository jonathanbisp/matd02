import datetime
from typing import List, Optional

from sqlalchemy import TIMESTAMP, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.models.base import Base


class Activity(Base):
    __tablename__ = "activities"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    id_subcategory: Mapped[int] = mapped_column(Integer, ForeignKey("subcategories.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(2048), nullable=False)
    hours_limit: Mapped[int] = mapped_column(Integer, nullable=True)
    comprobatory_rules: Mapped[str] = mapped_column(String(2048), nullable=True)
    additional_rules: Mapped[str] = mapped_column(String(2048), nullable=True)

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

    subcategory = relationship("Subcategory", back_populates="activities")
    activity_registers = relationship(
        "ActivityRegister", back_populates="users", cascade="all, delete-orphan"
    )

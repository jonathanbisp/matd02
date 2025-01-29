import datetime
from typing import List, Optional

from sqlalchemy import ForeignKey, String, TIMESTAMP, Integer, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.models.base import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    course_id = mapped_column(Integer, ForeignKey("courses.id"), nullable=True)
    baseline_id = mapped_column(Integer, ForeignKey("baselines.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    salt_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_approver: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
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

    course = relationship("Courses", back_populates="users")
    baseline = relationship("Baseline", back_populates="users")
    activity_registers = relationship(
        "ActivityRegister", back_populates="users", cascade="all, delete-orphan"
    )

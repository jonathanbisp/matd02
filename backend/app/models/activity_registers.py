import datetime
from typing import List, Optional

from sqlalchemy import TIMESTAMP, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.models.base import Base


class ActivityRegister(Base):
    __tablename__ = "activity_registers"
    id: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    id_approver: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    id_category: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id"), nullable=False)
    id_subcategory: Mapped[int] = mapped_column(Integer, ForeignKey("subcategories.id"), nullable=False)
    id_activity: Mapped[int] = mapped_column(Integer, ForeignKey("activities.id"), nullable=False)
    short_description: Mapped[str] = mapped_column(String(255), nullable=False)
    init_date: Mapped[datetime.datetime] = mapped_column(TIMESTAMP, nullable=False)
    end_date: Mapped[datetime.datetime] = mapped_column(TIMESTAMP, nullable=False)
    wanted_hours: Mapped[int] = mapped_column(Integer, nullable=False)
    worked_hours: Mapped[int] = mapped_column(Integer, nullable=False)
    computed_hours: Mapped[int] = mapped_column(Integer, nullable=True)
    reason_to_approve: Mapped[str] = mapped_column(String(2048), nullable=False)
    approver_feedback: Mapped[str] = mapped_column(String(2048), nullable=True)
    status: Mapped[str] = mapped_column(String(255), nullable=False)
    approved_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP,
        default=datetime.datetime.now(tz=datetime.timezone.utc),
        nullable=False,
    )
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    updated_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP,
        onupdate=datetime.datetime.now(tz=datetime.timezone.utc),
        nullable=False,
    )
    updated_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    comprobatory_documents = relationship(
        "ComprobatoryDocument",
        back_populates="activity_register",
        cascade="all, delete-orphan",
    )
    user = relationship("User", back_populates="activity_registers")
    approver = relationship("User", back_populates="activity_registers")
    category = relationship("Category", back_populates="activity_registers")
    subcategory = relationship("Subcategory", back_populates="activity_registers")
    activity = relationship("Activity", back_populates="activity_registers")

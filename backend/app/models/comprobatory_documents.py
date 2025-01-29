import datetime
from typing import List, Optional

from sqlalchemy import TIMESTAMP, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.models.base import Base


class ComprobatoryDocument(Base):
    __tablename__ = "comprobatory_documents"
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_register_id: Mapped[int] = mapped_column(Integer, ForeignKey("activity_registers.id"), nullable=False)
    url: Mapped[str] = mapped_column(String(2048), nullable=True)

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

    activity_register = relationship("ActivityRegister", back_populates="comprobatory_documents")

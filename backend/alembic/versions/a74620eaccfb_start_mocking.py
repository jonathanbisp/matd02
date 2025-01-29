"""start mocking

Revision ID: a74620eaccfb
Revises: ff67ab4d895c
Create Date: 2025-01-29 01:59:07.126816

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a74620eaccfb'
down_revision: Union[str, None] = 'ff67ab4d895c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    print(op.execute(
       """INSERT INTO courses (name, created_at, updated_at)
        VALUES ('Bacharelado Ciência da Computação', '2025-01-29 01:17:57.288128', '2025-01-29 01:17:57.288128')
        RETURNING id
        """
    ))
    
    op.execute(
        """
        INSERT INTO baselines (id_course, reference_period, created_at, updated_at)
        VALUES (1, '2022.1', '2025-01-29 01:17:57.288128', '2025-01-29 01:17:57.288128')
        """
    )
    op.execute( # coordenador
        """
        INSERT INTO users (course_id, name, email, hashed_password, salt_password, is_active, is_superuser, is_approver, created_at, updated_at)
        VALUES (1, 'Cláudio Nogueira Sant''Anna', 'santanna@ufba.br', '123456', '123456', true, false, true, '2025-01-29 01:17:57.288128', '2025-01-29 01:17:57.288128')
        """
    )
    op.execute( # alunos
        """
        INSERT INTO users (course_id, baseline_id, name, email, hashed_password, salt_password, is_active, is_superuser, is_approver, created_at, updated_at)
        VALUES (1, 1, 'Josefina Margarida', 'josefina.margarida@ufba.br', '123456', '123456', true, false, false, '2025-01-29 01:17:57.288128', '2025-01-29 01:17:57.288128')
        """
    )
    op.execute(# category 
        """
        INSERT INTO categories (baseline_id, name, description, minimal_hours, created_at, updated_at)
        VALUES (1, 'Extensão', 'Atividades de extensão.', 330, '2025-01-29 01:17:57.288128', '2025-01-29 01:17:57.288128')
        """
    )
    op.execute(
        """
        INSERT INTO subcategories (category_id, name, description, created_at, updated_at)
        VALUES (1, 'Extensão', 'Atividades de extensão.', '2025-01-29 01:17:57.288128', '2025-01-29 01:17:57.288128')
        """
    )
    op.execute(
        """
        INSERT INTO activities (id_subcategory, name, description, created_at, updated_at)
        VALUES (1, 'Ação Curricular em Comunidade e Sociedade (ACCS)', 'Participar de uma ACCS.', '2025-01-29 01:17:57.288128', '2025-01-29 01:17:57.288128')
        """
    )
    op.execute(
        """
        INSERT INTO activities (id_subcategory, name, description, hours_limit, comprobatory_rules, additional_rules, created_at, updated_at)
        VALUES (1, 'Estágio supervisionado', 'Estágio supervisionado - obrigatório e não-obrigatório', 90, 'Plano de estágio e relatório de conclusão da atividade com assinatura dos responsáveis pela atividade.', '45 horas por semestre. A CH máxima representa 27%% do total.', '2025-01-29 01:17:57.288128', '2025-01-29 01:17:57.288128')
        """	
    )
    

def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.execute("DELETE FROM courses WHERE name = 'Bacharelado Ciência da Computação'")
    op.execute("DELETE FROM baselines WHERE reference_period = '2022.1'")
    op.execute("DELETE FROM users WHERE email = 'santanna@ufba.br'")
    op.execute("DELETE FROM users WHERE email = 'josefina.margarida@ufba.br'")
    op.execute("DELETE FROM categories WHERE name = 'Extensão'")
    op.execute("DELETE FROM subcategories WHERE name = 'Extensão'")
    op.execute("DELETE FROM activities WHERE name = 'Ação Curricular em Comunidade e Sociedade (ACCS)'")
    
    op.execute(
        """
        DELETE FROM activities WHERE name = 'Estágio supervisionado'
        """	
    )
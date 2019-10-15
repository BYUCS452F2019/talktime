"""Preferred timezone nullable

Revision ID: fe451c98836d
Revises: 451d26736ba7
Create Date: 2019-10-13 18:36:56.529026

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fe451c98836d'
down_revision = '451d26736ba7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'pref_timezone',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'pref_timezone',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###

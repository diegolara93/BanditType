"""username foreign key on stats

Revision ID: f512a2c7f2de
Revises: 1ba88800dc0b
Create Date: 2025-02-20 17:40:23.043914

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'f512a2c7f2de'
down_revision: Union[str, None] = '1ba88800dc0b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('stats', sa.Column('username', sa.String(length=30), nullable=True))
    op.alter_column('stats', 'averageWPM',
               existing_type=mysql.FLOAT(),
               nullable=False)
    op.alter_column('stats', 'highestWPM',
               existing_type=mysql.FLOAT(),
               nullable=False)
    op.drop_constraint('stats_ibfk_1', 'stats', type_='foreignkey')
    op.create_foreign_key(None, 'stats', 'users', ['username'], ['username'])
    op.drop_column('stats', 'user_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('stats', sa.Column('user_id', mysql.VARCHAR(length=255), nullable=True))
    op.drop_constraint(None, 'stats', type_='foreignkey')
    op.create_foreign_key('stats_ibfk_1', 'stats', 'users', ['user_id'], ['uid'])
    op.alter_column('stats', 'highestWPM',
               existing_type=mysql.FLOAT(),
               nullable=True)
    op.alter_column('stats', 'averageWPM',
               existing_type=mysql.FLOAT(),
               nullable=True)
    op.drop_column('stats', 'username')
    # ### end Alembic commands ###

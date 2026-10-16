"""Position value object mirroring the UI's "row-col" cell ids."""

from dataclasses import dataclass


@dataclass(frozen=True, order=True)
class Position:
    row: int
    col: int

    @classmethod
    def from_id(cls, node_id: str) -> "Position":
        row, col = node_id.split("-")
        return cls(int(row), int(col))

    @property
    def id(self) -> str:
        return f"{self.row}-{self.col}"

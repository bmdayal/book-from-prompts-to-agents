import sqlite3
from mcp.server.mcpserver import MCPServer

mcp = MCPServer("analytics-db")

@mcp.tool()
def query_db(sql: str) -> list[dict]:
    """Run a read-only SQL query against the analytics database."""
    # Open the database read-only, so even a clever query can't change data.
    conn = sqlite3.connect("file:analytics.db?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute(sql).fetchmany(100)  # cap the result size
        return [dict(r) for r in rows]
    finally:
        conn.close()

if __name__ == "__main__":
    mcp.run()  # talks to the host app over stdio

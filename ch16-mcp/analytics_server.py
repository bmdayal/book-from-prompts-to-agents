import sqlite3
from mcp.server.mcpserver import MCPServer

mcp = MCPServer("analytics-db")

# Allow only reading data and calling functions.
ALLOWED = {sqlite3.SQLITE_SELECT, sqlite3.SQLITE_READ,
           sqlite3.SQLITE_FUNCTION}

def read_only(action, arg1, arg2, db_name, source):
    if action in ALLOWED:
        return sqlite3.SQLITE_OK
    return sqlite3.SQLITE_DENY

@mcp.tool()
def query_db(sql: str) -> list[dict]:
    """Run a read-only SQL query on the sales data."""
    # Two layers: a read-only file, and only reads allowed.
    uri = "file:analytics.db?mode=ro"
    conn = sqlite3.connect(uri, uri=True)
    conn.set_authorizer(read_only)
    conn.row_factory = sqlite3.Row
    try:
        # Cap the result at 100 rows.
        rows = conn.execute(sql).fetchmany(100)
        return [dict(r) for r in rows]
    finally:
        conn.close()

if __name__ == "__main__":
    mcp.run()  # talks to the host app over stdio

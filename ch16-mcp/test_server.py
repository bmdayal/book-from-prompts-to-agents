"""End-to-end test: talks to analytics_server.py through a real MCP client over stdio, then checks the database file itself."""
import asyncio, os, sqlite3, sys
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

def count(): c = sqlite3.connect("analytics.db"); n = c.execute("select count(*) from sales").fetchone()[0]; c.close(); return n
def text_of(res): return " ".join(getattr(b, "text", "") for b in res.content)[:90].replace("\n", " ")

async def main():
    before = count()
    params = StdioServerParameters(command=sys.executable, args=[sys.argv[1] if len(sys.argv)>1 else "analytics_server.py"])
    async with stdio_client(params) as (r, w):
        async with ClientSession(r, w) as s:
            await s.initialize()
            print("tools:", [t.name for t in (await s.list_tools()).tools])
            cases = [
              ("plain SELECT", "select id, amount from sales where id <= 3"),
              ("result cap (150 rows exist)", "select * from sales"),
              ("DROP TABLE", "drop table sales"),
              ("INSERT", "insert into sales(amount) values (999)"),
              ("UPDATE", "update sales set amount = 0"),
              ("stacked: SELECT 1; DROP TABLE", "select 1; drop table sales"),
              ("comment trick: SELECT --\\nDROP", "select 1 -- \n; drop table sales"),
              ("ATTACH a new file", "attach database 'file:evil_created.db?mode=rwc' as e"),
              ("PRAGMA", "pragma table_info(sales)"),
              ("schema via sqlite_master", "select name from sqlite_master"),
              ("schema via pragma_table_info", "select name from pragma_table_info('sales')"),
              ("aggregate", "select count(*), round(avg(amount), 2) from sales"),
              ("join + subquery", "select s.id from sales s where s.amount > (select avg(amount) from sales) limit 2"),
              ("recursive query", "with recursive n(x) as (select 1 union all select x+1 from n where x<3) select x from n"),
            ]
            for name, sql in cases:
                res = await s.call_tool("query_db", {"sql": sql})
                rows = len([b for b in res.content]) if not res.is_error else 0
                print(f"{name:32} is_error={res.is_error!s:5} content_items={len(res.content):<4} first: {text_of(res)}")
    after = count()
    print("rows before/after:", before, after, "| table intact:", before == after)
    print("evil_created.db exists after ATTACH test:", os.path.exists("evil_created.db"))
asyncio.run(main())

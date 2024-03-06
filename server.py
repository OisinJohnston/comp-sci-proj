import sqlite3
import aiohttp
from aiohttp import web

con = sqlite3.connect("database.db")

cur = con.cursor()

cur.execute("CREATE TABLE IF NOT EXISTS water_intake(timestamp DATE PRIMARY KEY, waterconsumed int, temperature int);""")

routes = web.RouteTableDef()

@routes.get('/')
async def index(request):
	return web.HTTPFound('/index.html')


@routes.get('/data')
async def data(request):
	return web.json_response(cur.execute("SELECT * FROM water_intake ORDER BY timestamp DESC LIMIT 7;").fetchall()[::-1])


routes.static('/', './static')
app = web.Application()
app.add_routes(routes)



web.run_app(app)



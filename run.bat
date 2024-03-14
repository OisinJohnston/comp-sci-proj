title Server d[ o_0 ]b


call py -m pip install aiohttp pyserial serial-tool
cls
call start "" http://localhost:8080/
start /B py serial_reader.py
call py server.py

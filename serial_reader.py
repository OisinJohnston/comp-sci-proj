#!/usr/bin/env python3
import sqlite3
import serial
from serial.tools import list_ports
from datetime import datetime


PID_MICROBIT = 516
VID_MICROBIT = 3368
TIMEOUT = 0.1

# Database setup

# Establish a connection with the sqlite database at database.db this is nothing more than a file
con = sqlite3.connect("database.db")

cur = con.cursor()

cur.execute("CREATE TABLE IF NOT EXISTS water_intake(timestamp DATE PRIMARY KEY, waterconsumed int, temperature int);")

def find_comport(pid, vid, baud):
	# A simple function to find the port the microbit is running on if none is found it will return None.
	ser_port = serial.Serial(timeout=0.1)
	ser_port.baudrate = baud
	
	for p in list_ports.comports():
		if p.pid == pid and p.vid == vid:
			print(f"Found target device: \n\tport: {p.device}")
			ser_port.port = str(p.device)
			return ser_port

	return None


def main():
	while (ser_micro := find_comport(PID_MICROBIT, VID_MICROBIT, 115200)) is None: pass;
	ser_micro.open()
	while True:
		try:
			inp = ser_micro.readline().decode('utf-8').strip()
		except Exception as e:
			print(str(e))
			print("Attempting Recconnect...")
			while (ser_micro := find_comport(PID_MICROBIT, VID_MICROBIT, 115200)) is None: pass;
			ser_micro.open()
			print("Reconnected Successfully")
			
		if inp != "":
			try:
				new_val, temp =  (int(round(float(i),0)) for i in inp.strip().split(','))
				cur.execute("REPLACE INTO water_intake VALUES (?, ?, ?)", [datetime.utcnow().date().isoformat(), new_val, temp])
				con.commit()
			except:
				print(f"Failed to parse and commit string: {inp}")

	


if __name__ == '__main__':
	main()






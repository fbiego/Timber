/*
   MIT License

  Copyright (c) 2023 Felix Biego

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  ______________  _____
  ___  __/___  /_ ___(_)_____ _______ _______
  __  /_  __  __ \__  / _  _ \__  __ `/_  __ \
  _  __/  _  /_/ /_  /  /  __/_  /_/ / / /_/ /
  /_/     /_.___/ /_/   \___/ _\__, /  \____/
							  /____/

*/

#ifndef TIMBER_H
#define TIMBER_H

#include <Arduino.h>

enum Level
{
	DEBUG = 0,
	INFO,
	ERROR,
	VERBOSE,
	WARNING,
	WTF
};

class TimberClass
{

public:

	void setPrint(bool state);
	void showTime(bool state);
	void setLogCallback(void (*callback)(Level, unsigned long, String));

	void d(String msg);
	void d(const char *format, ...);
	void e(String msg);
	void e(const char *format, ...);
	void i(String msg);
	void i(const char *format, ...);
	void v(String msg);
	void v(const char *format, ...);
	void w(String msg);
	void w(const char *format, ...);
	void wtf(String msg);
	void wtf(const char *format, ...);

	void log(Level level, String msg);
	void log(Level level, const char *format, ...);

	

private:
	void (*loggingCallback)(Level, unsigned long, String) = nullptr;
	bool _print;
	bool _time;

	String levelName(Level level);
	void sendLogs(Level level, String message);
};

extern TimberClass Timber;

#endif

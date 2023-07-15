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

#include <Timber.h>
#include <stdarg.h>

TimberClass Timber;

/*!
	@brief  set the print state
	@param  state
			the state
*/
void TimberClass::setPrint(bool state)
{
	_print = state;
}

/*!
	@brief  set whether to show time
	@param  state
			the state
*/
void TimberClass::showTime(bool state)
{
	_time = state;
}

/*!
	@brief  set the logging callback
	@param  callback
			the  callback
*/
void TimberClass::setLogCallback(void (*callback)(Level, unsigned long, String))
{
	loggingCallback = callback;
}

/*!
	@brief  log debug
	@param  msg
			the debug message
*/
void TimberClass::d(String msg)
{
	log(DEBUG, msg);
}

/*!
	@brief  log debug
	@param  format
			the message format
	@param  ...
			the arguments
*/
void TimberClass::d(const char *format, ...)
{
	va_list args;
	va_start(args, format);

	char buffer[256]; // Buffer to hold the formatted string

	// Format the string using vsnprintf
	vsnprintf(buffer, sizeof(buffer), format, args);

	log(DEBUG, String(buffer));

	va_end(args);
}

/*!
	@brief  log error
	@param  msg
			the error message
*/
void TimberClass::e(String msg)
{
	log(ERROR, msg);
}

/*!
	@brief  log error
	@param  format
			the message format
	@param  ...
			the arguments
*/
void TimberClass::e(const char *format, ...)
{
	va_list args;
	va_start(args, format);

	char buffer[256]; // Buffer to hold the formatted string

	// Format the string using vsnprintf
	vsnprintf(buffer, sizeof(buffer), format, args);

	log(ERROR, String(buffer));

	va_end(args);
}

/*!
	@brief  log info
	@param  msg
			the info message
*/
void TimberClass::i(String msg)
{
	log(INFO, msg);
}

/*!
	@brief  log info
	@param  format
			the message format
	@param  ...
			the arguments
*/
void TimberClass::i(const char *format, ...)
{
	va_list args;
	va_start(args, format);

	char buffer[256]; // Buffer to hold the formatted string

	// Format the string using vsnprintf
	vsnprintf(buffer, sizeof(buffer), format, args);

	log(INFO, String(buffer));

	va_end(args);
}

/*!
	@brief  log verbose
	@param  msg
			the verbose message
*/
void TimberClass::v(String msg)
{
	log(VERBOSE, msg);
}

/*!
	@brief  log verbose
	@param  format
			the message format
	@param  ...
			the arguments
*/
void TimberClass::v(const char *format, ...)
{
	va_list args;
	va_start(args, format);

	char buffer[256]; // Buffer to hold the formatted string

	// Format the string using vsnprintf
	vsnprintf(buffer, sizeof(buffer), format, args);

	log(VERBOSE, String(buffer));

	va_end(args);
}

/*!
	@brief  log warning
	@param  msg
			the warning message
*/
void TimberClass::w(String msg)
{
	log(WARNING, msg);
}

/*!
	@brief  log warning
	@param  format
			the message format
	@param  ...
			the arguments
*/
void TimberClass::w(const char *format, ...)
{
	va_list args;
	va_start(args, format);

	char buffer[256]; // Buffer to hold the formatted string

	// Format the string using vsnprintf
	vsnprintf(buffer, sizeof(buffer), format, args);

	log(WARNING, String(buffer));

	va_end(args);
}

/*!
	@brief  log wtf
	@param  msg
			the wtf message
*/
void TimberClass::wtf(String msg)
{
	log(WTF, msg);
}

/*!
	@brief  log wtf
	@param  format
			the message format
	@param  ...
			the arguments
*/
void TimberClass::wtf(const char *format, ...)
{
	va_list args;
	va_start(args, format);

	char buffer[256]; // Buffer to hold the formatted string

	// Format the string using vsnprintf
	vsnprintf(buffer, sizeof(buffer), format, args);

	log(WTF, String(buffer));

	va_end(args);
}

/*!
	@brief  log
	@param  msg
			the  message
*/
void TimberClass::log(Level level, String msg)
{
	sendLogs(level, msg);
}

/*!
	@brief  log
	@param  level
			the level type
	@param  format
			the message format
	@param  ...
			the arguments
*/
void TimberClass::log(Level level, const char *format, ...)
{
	va_list args;
	va_start(args, format);

	char buffer[256]; // Buffer to hold the formatted string

	// Format the string using vsnprintf
	vsnprintf(buffer, sizeof(buffer), format, args);

	sendLogs(level, String(buffer));

	va_end(args);
}

/*!
	@brief  return the level name
	@param  level
			the  level type
*/
String TimberClass::levelName(Level level)
{
	switch (level)
	{
	case DEBUG:
		return "[DEBUG]";
		break;
	case ERROR:
		return "[ERROR]";
		break;
	case INFO:
		return "[INFO]";
		break;
	case VERBOSE:
		return "[VERBOSE]";
		break;
	case WARNING:
		return "[WARNING]";
		break;
	case WTF:
		return "[WTF]";
		break;
	default:
		return "[UNKNOWN]";
	}
}

/*!
	@brief  send the logs to callback or print
	@param  level
			the  level type
	@param  message
			the  message
*/
void TimberClass::sendLogs(Level level, String message)
{
	unsigned long time = millis();
	String msg;
	if (_time)
	{
		msg = String(time) + " " + levelName(level) + ": " + message + "\n";
	}
	else
	{
		msg = levelName(level) + ": " + message + "\n";
	}
	if (loggingCallback != nullptr)
	{
		loggingCallback(level, time, msg);
	}
	if (_print)
	{
		Serial.print(msg);
	}
}

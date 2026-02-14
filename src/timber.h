/*
   MIT License

  Copyright (c) 2026 Felix Biego

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

#include <stdint.h>
#include <stdbool.h>
#include <stdarg.h>

#ifdef __cplusplus
extern "C"
{
#endif

/* =========================
    Log levels (metadata only)
    ========================= */

typedef enum
{
    TIMBER_LEVEL_DEBUG = 0,
    TIMBER_LEVEL_INFO,
    TIMBER_LEVEL_WARNING,
    TIMBER_LEVEL_ERROR,
    TIMBER_LEVEL_VERBOSE,
    TIMBER_LEVEL_WTF

} timber_level_t;

/* =========================
    Function pointer types
    ========================= */

typedef uint32_t (*timber_time_func_t)(void);

typedef void (*timber_output_func_t)(
    timber_level_t level,
    uint32_t timestamp,
    const char *message);

/* =========================
    Core API
    ========================= */

void timber_init(void);

void timber_set_output(timber_output_func_t func);

void timber_set_time_func(timber_time_func_t func);

void timber_enable_colors(bool enable);

void timber_enable_timestamp(bool enable);

void timber_enable_newline(bool enable);

/* logging */

void timber_log(
    timber_level_t level,
    const char *fmt,
    ...);

void timber_logv(
    timber_level_t level,
    const char *fmt,
    va_list args);

/* convenience */

void timber_d(const char *fmt, ...);
void timber_i(const char *fmt, ...);
void timber_w(const char *fmt, ...);
void timber_e(const char *fmt, ...);
void timber_v(const char *fmt, ...);
void timber_wtf(const char *fmt, ...);

#ifdef __cplusplus
}
#endif

/* =========================
   Arduino / C++ wrapper
   ========================= */

#ifdef __cplusplus

class TimberClass
{
public:
    inline void setOutput(timber_output_func_t func)
    {
        timber_set_output(func);
    }

    inline void setTimeFunc(timber_time_func_t func)
    {
        timber_set_time_func(func);
    }

    inline void enableColors(bool enable)
    {
        timber_enable_colors(enable);
    }

    inline void enableTimestamp(bool enable)
    {
        timber_enable_timestamp(enable);
    }

    inline void enableNewline(bool enable)
    {
        timber_enable_newline(enable);
    }


    inline void log(timber_level_t level, const char *fmt, ...)
    {
        va_list args;
        va_start(args, fmt);
        timber_logv(level, fmt, args);
        va_end(args);
    }

    inline void d(const char *fmt, ...)
    {
        va_list args;
        va_start(args, fmt);
        timber_logv(TIMBER_LEVEL_DEBUG, fmt, args);
        va_end(args);
    }

    inline void i(const char *fmt, ...)
    {
        va_list args;
        va_start(args, fmt);
        timber_logv(TIMBER_LEVEL_INFO, fmt, args);
        va_end(args);
    }

    inline void w(const char *fmt, ...)
    {
        va_list args;
        va_start(args, fmt);
        timber_logv(TIMBER_LEVEL_WARNING, fmt, args);
        va_end(args);
    }

    inline void e(const char *fmt, ...)
    {
        va_list args;
        va_start(args, fmt);
        timber_logv(TIMBER_LEVEL_ERROR, fmt, args);
        va_end(args);
    }

    inline void v(const char *fmt, ...)
    {
        va_list args;
        va_start(args, fmt);
        timber_logv(TIMBER_LEVEL_VERBOSE, fmt, args);
        va_end(args);
    }

    inline void wtf(const char *fmt, ...)
    {
        va_list args;
        va_start(args, fmt);
        timber_logv(TIMBER_LEVEL_WTF, fmt, args);
        va_end(args);
    }
};

extern TimberClass Timber;

#endif

#endif

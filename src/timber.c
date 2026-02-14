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

#include "timber.h"

#include <stdio.h>

#ifndef TIMBER_BUFFER_SIZE
#define TIMBER_BUFFER_SIZE 256
#endif

typedef struct
{
    timber_output_func_t output;

    timber_time_func_t time_func;

    bool colors;

    bool timestamp;

    bool newline;

} timber_ctx_t;

static timber_ctx_t ctx =
    {
        .output = 0,
        .time_func = 0,
        .colors = false,
        .timestamp = false,
        .newline = true // default enabled
};

static const char *level_str[] =
    {
        "[DEBUG]",
        "[INFO]",
        "[WARNING]",
        "[ERROR]",
        "[VERBOSE]",
        "[WTF]"};

static const char *level_color[] =
    {
        "\033[34m",
        "\033[32m",
        "\033[33m",
        "\033[31m",
        "\033[36m",
        "\033[35m"};

void timber_init(void)
{
}

void timber_set_output(timber_output_func_t func)
{
    ctx.output = func;
}

void timber_set_time_func(timber_time_func_t func)
{
    ctx.time_func = func;
}

void timber_enable_colors(bool enable)
{
    ctx.colors = enable;
}

void timber_enable_timestamp(bool enable)
{
    ctx.timestamp = enable;
}

void timber_enable_newline(bool enable)
{
    ctx.newline = enable;
}

void timber_logv(
    timber_level_t level,
    const char *fmt,
    va_list args)
{
    if (!ctx.output)
        return;

    char msg[TIMBER_BUFFER_SIZE];

    vsnprintf(msg, sizeof(msg), fmt, args);

    char final[TIMBER_BUFFER_SIZE];

    uint32_t ts = 0;

    if (ctx.timestamp && ctx.time_func)
        ts = ctx.time_func();

    const char *newline = ctx.newline ? "\n" : "";

    if (ctx.timestamp)
    {
        if (ctx.colors)
        {
            snprintf(
                final,
                sizeof(final),
                "%s%lu %s: %s\033[0m%s",
                level_color[level],
                (unsigned long)ts,
                level_str[level],
                msg,
                newline);
        }
        else
        {
            snprintf(
                final,
                sizeof(final),
                "%lu %s: %s%s",
                (unsigned long)ts,
                level_str[level],
                msg,
                newline);
        }
    }
    else
    {
        if (ctx.colors)
        {
            snprintf(
                final,
                sizeof(final),
                "%s%s: %s\033[0m%s",
                level_color[level],
                level_str[level],
                msg,
                newline);
        }
        else
        {
            snprintf(
                final,
                sizeof(final),
                "%s: %s%s",
                level_str[level],
                msg,
                newline);
        }
    }

    ctx.output(level, ts, final);
}

void timber_log(
    timber_level_t level,
    const char *fmt,
    ...)
{
    va_list args;

    va_start(args, fmt);

    timber_logv(level, fmt, args);

    va_end(args);
}

/* convenience */

#define TIMBER_IMPL(name, lvl)               \
    void timber_##name(const char *fmt, ...) \
    {                                        \
        va_list args;                        \
        va_start(args, fmt);                 \
        timber_logv(lvl, fmt, args);         \
        va_end(args);                        \
    }

TIMBER_IMPL(d, TIMBER_LEVEL_DEBUG)
TIMBER_IMPL(i, TIMBER_LEVEL_INFO)
TIMBER_IMPL(w, TIMBER_LEVEL_WARNING)
TIMBER_IMPL(e, TIMBER_LEVEL_ERROR)
TIMBER_IMPL(v, TIMBER_LEVEL_VERBOSE)
TIMBER_IMPL(wtf, TIMBER_LEVEL_WTF)

# Timber

Timber is a lightweight, portable logging library for embedded systems written in pure C, with an optional C++ wrapper for Arduino compatibility.

It is inspired by the excellent [Timber](https://github.com/JakeWharton/timber) library for Android, but is not affiliated with or directly related to it.

Timber is designed to work across multiple platforms.


# Features

* Pure C core (portable across embedded platforms)
* Arduino-friendly C++ wrapper
* Custom output function support
* Optional timestamps
* Optional ANSI colors
* No dynamic memory allocation
* Minimal overhead

# Web Serial Console

[Web Console](console/README.md)

[https://fbiego.com/timber/](https://fbiego.com/timber/)

![screenshot](console/screenshot.png?raw=true "screenshot")


# Installation

## Arduino

Install via Arduino Library Manager or clone into your libraries folder:

```
Documents/Arduino/libraries/Timber
```

Include in your sketch:

```cpp
#include <timber.h>
```



## CMake

Add the library and include:

```c
#include "timber.h"
```

Then configure output and time functions.



# Basic Usage (Arduino)

Default output uses `Serial`.

```cpp
#include <timber.h>

void setup()
{
    Serial.begin(115200);

    Timber.i("System started");
    Timber.w("Low memory");
    Timber.e("Failed to connect");
}

void loop()
{
}
```


# Basic Usage (Pure C)

```c
#include "timber.h"

uint32_t my_time()
{
    return millis();
}

void my_output(
    timber_level_t level,
    uint32_t timestamp,
    const char *msg)
{
    printf("%s", msg);
}

int main()
{
    timber_set_output(my_output);
    timber_set_time_func(my_time);

    timber_i("Hello world");

    return 0;
}
```


# Configuration

## Set output function

Routes log output to any interface (UART, USB, BLE, file, etc.)

Arduino example:

```cpp
void myOutput(
    timber_level_t level,
    uint32_t timestamp,
    const char *msg)
{
    Serial.write(msg);
}

Timber.setOutput(myOutput);
```


## Set timestamp function

```cpp
uint32_t myTime()
{
    return millis();
}

Timber.setTimeFunc(myTime);
```


## Enable or disable colors

```cpp
Timber.enableColors(true);
Timber.enableColors(false);
```


## Enable or disable timestamps

```cpp
Timber.enableTimestamp(true);
Timber.enableTimestamp(false);
```

## Enable or disable new line ending

```cpp
Timber.enableNewline(true);
Timber.enableNewline(false);
```


# Log Levels

```
TIMBER_LEVEL_DEBUG
TIMBER_LEVEL_INFO
TIMBER_LEVEL_WARNING
TIMBER_LEVEL_ERROR
TIMBER_LEVEL_VERBOSE
TIMBER_LEVEL_WTF
TIMBER_LEVEL_NONE
```


# Logging Functions

## Arduino / C++

```cpp
Timber.d("Debug message");
Timber.i("Info message");
Timber.w("Warning message");
Timber.e("Error message");
Timber.v("Verbose message");
```

Formatted logging:

```cpp
Timber.i("Value: %d", value);
```


## Pure C

```c
timber_d("Debug message");
timber_i("Info message");
timber_w("Warning message");
timber_e("Error message");
timber_v("Verbose message");
timber_wtf("Critical error");
```

Formatted logging:

```c
timber_i("Temperature: %d C", temp);
```



# Output Function Signature

```c
typedef void (*timber_output_func_t)(
    timber_level_t level,
    uint32_t timestamp,
    const char *message
);
```

# Buffer size

Change buffer size using defines
```c
#define TIMBER_BUFFER_SIZE 1024
```


# Design Goals

* Platform-independent
* Zero heap usage
* Minimal footprint
* Maximum flexibility
* Arduino compatibility
* Embedded-first architecture


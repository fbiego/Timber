# Timber
This is a wrapper logger Arduino library that takes inspiration from [Timber](https://github.com/JakeWharton/timber) but is not directly associated with it.


## Functions

```
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
```

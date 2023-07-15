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

void logCallback(Level level, unsigned long time, String message)
{
  Serial.print(message);

  switch (level)
  {
  case ERROR:
    // maybe save only errors to local storage
    break;
  }
}

void setup()
{
  Serial.begin(115200);

  Timber.setLogCallback(logCallback); // use a callback function to show logs (recommended)

  // use print to show the logs over serial port, uses Serial.print()
  // Timber.setPrint(true); // print the logs from inside the class (not recommended)

  // Timber.showTime(true); // show the running time [from millis()]

  // start logging
  Timber.i("Setup complete");
  Timber.d("Time %d", millis());
  Timber.log(WARNING, "Now exiting setup");
}

void loop()
{

  static int x = 0;

  Timber.e("An error in the loop");
  Timber.wtf("Something happened here");
  Timber.v("Loop count %d", x);
  x++;
  delay(5000);
}

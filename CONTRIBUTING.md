# Contributing to invisible-grecaptcha

First off, thanks for taking the time to contribute!

Now, take a moment to be sure your contributions make sense to everyone else.
These are just guidelines, not rules.
Use your best judgment, and feel free to propose changes to this document in a pull request.

## Reporting Issues

Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](https://github.com/thiamsantos/invisible-grecaptcha/issues).
If don't, just open a [new clear and descriptive issue](https://github.com/thiamsantos/invisible-grecaptcha/issues/new).

## Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.
And submit your pull request after making sure that all tests pass and they are covering 100% of the code.

- Fork it!
- Clone your fork: `git clone https://github.com/<your-username>/invisible-grecaptcha`
- Navigate to the newly cloned directory: `cd invisible-grecaptcha`
- Create a new branch for the new feature: `git checkout -b my-new-feature`
- Install the tools necessary for development: `npm install`
- Make your changes.
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request with full remarks documenting your changes.

## Testing

Unit tests can be found in [test/test.js](test/test.js). They have been written using [puppeteer](https://github.com/GoogleChrome/puppeteer), which in turn controls a headless [Chromium](https://www.chromium.org/Home) browser to exercise the API. puppeteer downloads an instance of Chromium during the `npm insall` process, so no special installation or configuration should be needed, but of course your mileage may vary.

To run tests, simply execute `npm test`. Ensure that all existing unit tests are passing before submitting a pull request because they will be checked as part of the CI process.

Even better, add more unit tests to validate your enhancements. When writing tests, remember to answer all the questions:

1. What are you testing?
2. What should it do?
3. What is the actual output?
4. What is the expected output?
5. How can the test be reproduced?

## Code Style

Follow the [xo](https://github.com/sindresorhus/xo) style.
Using two spaces for identation and no [semicolons](http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding).

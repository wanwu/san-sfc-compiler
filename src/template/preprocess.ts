export default function (
  options: {
    source: string;
    filename: string;
    preprocessOptions?: any;
  },
  preprocessor: any
): string {
  const { source, filename, preprocessOptions } = options;

  const finalPreprocessOptions = Object.assign(
    {
      filename,
    },
    preprocessOptions
  );

  // Consolidate exposes a callback based API, but the callback is in fact
  // called synchronously for most templating engines. In our case, we have to
  // expose a synchronous API so that it is usable in Jest transforms (which
  // have to be sync because they are applied via Node.js require hooks)
  let res: any, err;

  preprocessor.render(
    source,
    finalPreprocessOptions,
    (_err: Error | null, _res: string) => {
      if (_err) err = _err;
      res = _res;
    }
  );

  if (err) throw err;

  return res;
}

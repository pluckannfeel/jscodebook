import * as esbuild from 'esbuild-wasm';
// import ReactDom from 'react-dom';
import { createRoot } from 'react-dom/client';
import { useEffect, useState, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const ref = useRef<any>(null);

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const submitHandler = async () => {
    if (!ref.current) return;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // console.log(result)

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea cols={100} rows={30}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={submitHandler}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

// ReactDom.render(<App />, document.querySelector('#root'));
const container = document.querySelector('#root');
const root = createRoot(container!);
root.render(<App />);

# img-compress-loader

> Image compress loader for webpack.

## Support Images

- .png -> [`optipng`](https://www.npmjs.org/package/optipng-bin)
- .jpg/.jpeg -> [`jpegtran`](https://www.npmjs.com/package/jpegtran-bin)
- .gif -> [`gifsicle`](https://www.npmjs.com/package/gifsicle)

## Usage

webpack.config.js:

```
{
    module: {
        loaders: [
            {
                test: /\.(png|jpg|gif|woff|woff2|svg)(\?\w+)?$/,
                loader: 'url-loader?name=images/[name].[ext]&limit=8192!img-compress-loader'
            },
        ]
    }
}
```

## History

- [0.2.0]
  - switch back to original `gifsicle`, `jpegtran-bin` and `optipng-bin`.
- [0.1.0]
	- init version.
- [0.1.2]
	- bugfix for dead loop img compress.
- [0.1.3]
	- img compress lib install to node_modules locally.
- [0.1.5]
	- move common dependencies to speed up install.
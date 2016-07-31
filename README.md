# img-compress-loader

> Image compress loader for webpack.

## Support Images

- .png -> `optipng`
- .jpg/.jpeg -> `jpegtran`
- .gif -> `gifsicle`

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

- [0.1.0]
    - init version.
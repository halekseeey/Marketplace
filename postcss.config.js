module.exports = {
    plugins: [
        'postcss-nested',
        'postcss-import',
        'postcss-flexbugs-fixes',
        [
            'postcss-preset-env',
            {
                autoprefixer: {
                    flexbox: 'no-2009'
                },
                stage: 3,
                features: {
                    'custom-properties': true,
                    'nesting-rules': true
                }
            }
        ],
        'cssnano'
    ]
}
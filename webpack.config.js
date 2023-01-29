import path from "node:path";
import { exec } from "node:child_process";
import fs from "node:fs";

import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";

// const currentTask = process.env.npm_lifecycle_event;
const distPath = path.join(process.cwd(), "dist");
const exampleAssetsPath = path.join(process.cwd(), "example", "docs", "assets");
const currentTask = process.env.npm_lifecycle_event;

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "./package.json"), { encoding: "utf8" }));

class DeployPlugin {
    constructor(options) {
        this.options = Object.assign({}, options);
    }
    apply(compiler) {
        const deployPluginName = DeployPlugin.name;
        // compiler.hooks.before
        compiler.hooks.done.tap(deployPluginName, stats => {
            exec(`mkdir -p ${exampleAssetsPath} && cp ${distPath}/* ${exampleAssetsPath}/`, (error, stdout, stderr) => {
                if (error) {
                    throw error;
                }
                console.log(stdout);
            });
        });
    }
}

const config = {
    entry: {
        "live-demo": "./src/index.js",
    },
    output: {
        path: path.join(process.cwd(), "dist"),
        filename: "[name].js",
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                            sourceMap: false,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new MiniCssExtractPlugin({ filename: "[name].css" }), new DeployPlugin()],
    watch: true,
};

if (currentTask == "build") {
    config.mode = "production";
    config.watch = false;
    config.plugins.push(
        new webpack.BannerPlugin({
            entryOnly: true,
            banner: `${pkg.name} v${pkg.version} by ${pkg.author} | ${pkg.license}`,
        })
    );
    config.optimization = {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
    };
}

export default config;

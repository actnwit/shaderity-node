# shaderity-node

shaderity-node is the core part of the shaderity-loader.

The main feature of this library is the following.

1. If there is a description "#pragma shaderity: require(path)" in the shader code file, substitute the contents of the file in (argument resourcePath)/(path) into it. There is a sample in "How to use".

2. Determines if it is a vertex shader or fragment shader from the extension.

## How to use

You can use this via [shaderity-loader](https://github.com/actnwit/shaderity-loader).

Sample of feature 1:
Suppose you have two files in the same folder, as shown below.

test.glsl

``` glsl
#pragma shaderity: require(./version.glsl)

void main(){}
```

version.glsl

``` glsl
#version 100
```

If you use the requireFile method of this library to read test.glsl, it will load as follows:

```glsl
#version 100

void main(){}
```

## LICENSE

MIT License

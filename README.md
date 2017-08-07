# simele_fetch function

based on fetch api

## fetch api
your browser must support window.fetch or fetch api's pollyfill

## REQUIREMENT

the format of your server's response:

```
// success:
{
    ok: true,
    data: {}
}

// error:
{
    ok: false,
    code: 1,
    msg: 'error message'
}
```

## return:
fetch.js returns a promise, resolve when ok, or reject with error message.

## examples

```
import ajax from 'simple_fetch'
ajax({
    url: '/some/api'
    body: {
      foo: 'bar'
    }
  }).then((data) => {
    this.setState({
      someSt: data
    })
  }).catch((err) => {
    console.log(err)
  })
```

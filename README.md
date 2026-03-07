<h1 align="left">Top Badge 🏆</h1>

> **Note**  
> This project was built using [kerolloz/aktive](https://github.com/kerolloz/aktive) as a reference.

Top Badge is a simple web service. It returns a badge (or JSON) that shows your rank among other GitHub users from your country according to your GitHub contributions.

> **Note**  
>  
> Top Badge depends on the data provided by [ashkulz/committers.top](//github.com/ashkulz/committers.top).  
> So please make sure that your name appears on your country list here [committers.top](https://committers.top).

## Docs

> [!NOTE]
> You can also check the Swagger API documentation at `/swagger` for more details.

### Endpoints

#### GET `/`

Redirects to this repository.

---

#### GET `/:country/:username`

- Returns a [shields.io](https://shields.io) badge (SVG image) with your rank.

##### Parameters

- `country` - The country you live in (make sure it's visible on your profile).
- `username` - Your GitHub username.

##### Query Parameters

- `style` - Set the style of the badge. Can be one of `flat`, `flat-square`, `for-the-badge`, or `plastic`. Defaults to `flat`.
- `label` - Set the left-hand-side text. Defaults to `Most Active GitHub User Rank`.
- `color` - Set the background of the right part (hex, rgb, rgba, hsl, hsla and css named colors supported). Defaults to `brightgreen`.
- `labelColor` -  Set the background of the left part (hex, rgb, rgba, hsl, hsla and css named colors supported). Defaults to `grey`.
- `rnkPrefix` - Set prefix to display before the rank value. Defaults to `""` empty string.
- `rnkSuffix` - Set suffix to display after the rank value. Defaults to `""` empty string.

##### Examples

> `![badge](http://localhost:3000/egypt/3bsalam-1)`  
> ![badge](http://localhost:3000/egypt/3bsalam-1)

> `![badge](http://localhost:3000/egypt/3bsalam-1?style=flat-square&color=blue)`  
> ![badge](http://localhost:3000/egypt/3bsalam-1?style=flat-square&color=blue)  

---

#### GET `/rank/:country/:username`

- Returns a JSON object with your rank.

**Same parameters** as [GET `/:country/:username`](#get-countryusername)

##### Example

```bash
$ curl http://localhost:3000/rank/egypt/3bsalam-1

{
    "rank": "1st"
}
```

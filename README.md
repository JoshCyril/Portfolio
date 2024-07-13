Short Query for `Project`

```apache
*[_type == "project" && featured == true]{
  title,
  proImg,
  "slug": slug.current,
  description,
  proDate,
  "tags": tags[0...3]->{
    title,
    tagImg
  }
}
```


Full Query for `Project`

```apache
*[_type == "project" && slug.current == '${slug}']{
  title,
  proImg,
  summary,
  content,
  proDate,
  "links":links[]{title,description, url},
  gallery,
  "tags": tags[]->{
    title,
    tagImg
  }
}[0]
```

Main Query

```apache
*[_type == "about"]{
  tagline,
  profileIcon,
}
```

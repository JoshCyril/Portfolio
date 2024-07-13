export interface simpleProject {
  title: string;
  proImg: any;
  link: {
    title: string;
    url: string;
  };
  slug: string;
  description: string;
  proDate: string,
    tags: [{
      title: string,
      tagImg: any
    }],
    tagCount: number;
}

export interface fullProject {
  title: string;
  proImg: any;
  summary: any;
  content: any;
  proDate: string;
  links: [{
    title: string,
    description: string,
    url: string,
  }];
  slug: string;
  description: string;
  gallery: [{
    asset: any
  }];
  tags: [{
    title: string,
    tagImg: any
  }],
}

export interface tags {
  title: string;
  imageUrl: string;
}

export interface about {
  tagline: string;
}

export interface cvPDF{
  fileURL: string;
}

export interface footerData{
  copyright: string;
  udDate: Date;
}

export interface aboutNTag {
  about:[{
    content: any;
  }],
  tags:[
    {
      tag_name: string,
      tag_count: number,
      tag_url: any;
    }
  ]
}

export interface Ee3 {
    exp:[
      {
      title: string,
      yoe: string,
      content: any,
      company:
        {name: string,
        location: string,
        url: string,
        Img: any
        }
      }
    ],
    edu:[{
      title: string,
      uni:{
        name: string,
        location: string,
        url: string,
        Img: any
      }
    }]
}
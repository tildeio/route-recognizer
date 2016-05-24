(function() {
var root = typeof global == 'object' && global || this;
root.ROUTES = [
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/loading",
        "handler": "loading"
      }
    ],
    {
      "as": "loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/_unused_dummy_error_path_route_application/:error",
        "handler": "error"
      }
    ],
    {
      "as": "error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/loading",
        "handler": "configuration.loading"
      }
    ],
    {
      "as": "configuration.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/_unused_dummy_error_path_route_configuration/:error",
        "handler": "configuration.error"
      }
    ],
    {
      "as": "configuration.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/loading",
        "handler": "authentication.loading"
      }
    ],
    {
      "as": "authentication.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/_unused_dummy_error_path_route_authentication/:error",
        "handler": "authentication.error"
      }
    ],
    {
      "as": "authentication.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/loading",
        "handler": "feed.loading"
      }
    ],
    {
      "as": "feed.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/_unused_dummy_error_path_route_feed/:error",
        "handler": "feed.error"
      }
    ],
    {
      "as": "feed.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/loading",
        "handler": "feed.update.loading"
      }
    ],
    {
      "as": "feed.update.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/_unused_dummy_error_path_route_update/:error",
        "handler": "feed.update.error"
      }
    ],
    {
      "as": "feed.update.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/likes",
        "handler": "feed.update.likes"
      }
    ],
    {
      "as": "feed.update.likes"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/reshare",
        "handler": "feed.update.reshare"
      },
      {
        "path": "/loading",
        "handler": "feed.update.reshare.loading"
      }
    ],
    {
      "as": "feed.update.reshare.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/reshare",
        "handler": "feed.update.reshare"
      },
      {
        "path": "/_unused_dummy_error_path_route_reshare/:error",
        "handler": "feed.update.reshare.error"
      }
    ],
    {
      "as": "feed.update.reshare.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/reshare",
        "handler": "feed.update.reshare"
      },
      {
        "path": "/share",
        "handler": "feed.update.reshare.share"
      }
    ],
    {
      "as": "feed.update.reshare.share"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/reshare",
        "handler": "feed.update.reshare"
      },
      {
        "path": "/message",
        "handler": "feed.update.reshare.message"
      }
    ],
    {
      "as": "feed.update.reshare.message"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/reshare",
        "handler": "feed.update.reshare"
      },
      {
        "path": "/",
        "handler": "feed.update.reshare.index"
      }
    ],
    {
      "as": "feed.update.reshare.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/reshare",
        "handler": "feed.update.reshare"
      },
      {
        "path": "/",
        "handler": "feed.update.reshare.index"
      }
    ],
    {
      "as": "feed.update.reshare"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/rmview",
        "handler": "feed.update.rmview"
      }
    ],
    {
      "as": "feed.update.rmview"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/",
        "handler": "feed.update.index"
      }
    ],
    {
      "as": "feed.update.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/update/:updateId/",
        "handler": "feed.update"
      },
      {
        "path": "/",
        "handler": "feed.update.index"
      }
    ],
    {
      "as": "feed.update"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/share",
        "handler": "feed.share"
      },
      {
        "path": "/loading",
        "handler": "feed.share.loading"
      }
    ],
    {
      "as": "feed.share.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/share",
        "handler": "feed.share"
      },
      {
        "path": "/_unused_dummy_error_path_route_share/:error",
        "handler": "feed.share.error"
      }
    ],
    {
      "as": "feed.share.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/share",
        "handler": "feed.share"
      },
      {
        "path": "/url",
        "handler": "feed.share.url"
      }
    ],
    {
      "as": "feed.share.url"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/share",
        "handler": "feed.share"
      },
      {
        "path": "/",
        "handler": "feed.share.index"
      }
    ],
    {
      "as": "feed.share.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/share",
        "handler": "feed.share"
      },
      {
        "path": "/",
        "handler": "feed.share.index"
      }
    ],
    {
      "as": "feed.share"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/comment/:commentId",
        "handler": "feed.comment"
      },
      {
        "path": "/loading",
        "handler": "feed.comment.loading"
      }
    ],
    {
      "as": "feed.comment.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/comment/:commentId",
        "handler": "feed.comment"
      },
      {
        "path": "/_unused_dummy_error_path_route_comment/:error",
        "handler": "feed.comment.error"
      }
    ],
    {
      "as": "feed.comment.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/comment/:commentId",
        "handler": "feed.comment"
      },
      {
        "path": "/likes",
        "handler": "feed.comment.comment-likes"
      }
    ],
    {
      "as": "feed.comment.comment-likes"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/comment/:commentId",
        "handler": "feed.comment"
      },
      {
        "path": "/",
        "handler": "feed.comment.index"
      }
    ],
    {
      "as": "feed.comment.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/comment/:commentId",
        "handler": "feed.comment"
      },
      {
        "path": "/",
        "handler": "feed.comment.index"
      }
    ],
    {
      "as": "feed.comment"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/",
        "handler": "feed.index"
      }
    ],
    {
      "as": "feed.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m",
        "handler": "feed"
      },
      {
        "path": "/",
        "handler": "feed.index"
      }
    ],
    {
      "as": "feed"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/loading",
        "handler": "profile.loading"
      }
    ],
    {
      "as": "profile.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/_unused_dummy_error_path_route_profile/:error",
        "handler": "profile.error"
      }
    ],
    {
      "as": "profile.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/loading",
        "handler": "profile.view.loading"
      }
    ],
    {
      "as": "profile.view.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/_unused_dummy_error_path_route_view/:error",
        "handler": "profile.view.error"
      }
    ],
    {
      "as": "profile.view.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/background",
        "handler": "profile.view.detail-background"
      }
    ],
    {
      "as": "profile.view.detail-background"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/certifications",
        "handler": "profile.view.detail-certifications"
      }
    ],
    {
      "as": "profile.view.detail-certifications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/connections",
        "handler": "profile.view.detail-connections"
      },
      {
        "path": "/loading",
        "handler": "profile.view.detail-connections.loading"
      }
    ],
    {
      "as": "profile.view.detail-connections.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/connections",
        "handler": "profile.view.detail-connections"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-connections/:error",
        "handler": "profile.view.detail-connections.error"
      }
    ],
    {
      "as": "profile.view.detail-connections.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/connections",
        "handler": "profile.view.detail-connections"
      },
      {
        "path": "/",
        "handler": "profile.view.detail-connections.all"
      }
    ],
    {
      "as": "profile.view.detail-connections.all"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/connections",
        "handler": "profile.view.detail-connections"
      },
      {
        "path": "/",
        "handler": "profile.view.detail-connections.all"
      }
    ],
    {
      "as": "profile.view.detail-connections"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/connections",
        "handler": "profile.view.detail-connections"
      },
      {
        "path": "/shared",
        "handler": "profile.view.detail-connections.shared"
      }
    ],
    {
      "as": "profile.view.detail-connections.shared"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/contact-info",
        "handler": "profile.view.detail-contact-info"
      }
    ],
    {
      "as": "profile.view.detail-contact-info"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/courses",
        "handler": "profile.view.detail-courses"
      }
    ],
    {
      "as": "profile.view.detail-courses"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/honors",
        "handler": "profile.view.detail-honors"
      }
    ],
    {
      "as": "profile.view.detail-honors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recent-activity/interests/influencers",
        "handler": "profile.view.detail-interests-all-influencers"
      }
    ],
    {
      "as": "profile.view.detail-interests-all-influencers"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recent-activity/interests/companies",
        "handler": "profile.view.detail-interests-all-companies"
      }
    ],
    {
      "as": "profile.view.detail-interests-all-companies"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recent-activity/interests/schools",
        "handler": "profile.view.detail-interests-all-schools"
      }
    ],
    {
      "as": "profile.view.detail-interests-all-schools"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/patents",
        "handler": "profile.view.detail-patents"
      }
    ],
    {
      "as": "profile.view.detail-patents"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/projects",
        "handler": "profile.view.detail-projects"
      }
    ],
    {
      "as": "profile.view.detail-projects"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/publications",
        "handler": "profile.view.detail-publications"
      }
    ],
    {
      "as": "profile.view.detail-publications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view.detail-recent-activity"
      },
      {
        "path": "/loading",
        "handler": "profile.view.detail-recent-activity.loading"
      }
    ],
    {
      "as": "profile.view.detail-recent-activity.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view.detail-recent-activity"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-recent-activity/:error",
        "handler": "profile.view.detail-recent-activity.error"
      }
    ],
    {
      "as": "profile.view.detail-recent-activity.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view.detail-recent-activity"
      },
      {
        "path": "/",
        "handler": "profile.view.detail-recent-activity.activity"
      }
    ],
    {
      "as": "profile.view.detail-recent-activity.activity"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view.detail-recent-activity"
      },
      {
        "path": "/",
        "handler": "profile.view.detail-recent-activity.activity"
      }
    ],
    {
      "as": "profile.view.detail-recent-activity"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view.detail-recent-activity"
      },
      {
        "path": "/posts",
        "handler": "profile.view.detail-recent-activity.posts"
      }
    ],
    {
      "as": "profile.view.detail-recent-activity.posts"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view.detail-recent-activity"
      },
      {
        "path": "/interests",
        "handler": "profile.view.detail-recent-activity.interests"
      }
    ],
    {
      "as": "profile.view.detail-recent-activity.interests"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view.detail-recommendations"
      },
      {
        "path": "/loading",
        "handler": "profile.view.detail-recommendations.loading"
      }
    ],
    {
      "as": "profile.view.detail-recommendations.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view.detail-recommendations"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-recommendations/:error",
        "handler": "profile.view.detail-recommendations.error"
      }
    ],
    {
      "as": "profile.view.detail-recommendations.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view.detail-recommendations"
      },
      {
        "path": "/received",
        "handler": "profile.view.detail-recommendations.received"
      }
    ],
    {
      "as": "profile.view.detail-recommendations.received"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view.detail-recommendations"
      },
      {
        "path": "/given",
        "handler": "profile.view.detail-recommendations.given"
      }
    ],
    {
      "as": "profile.view.detail-recommendations.given"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view.detail-recommendations"
      },
      {
        "path": "/",
        "handler": "profile.view.detail-recommendations.index"
      }
    ],
    {
      "as": "profile.view.detail-recommendations.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view.detail-recommendations"
      },
      {
        "path": "/",
        "handler": "profile.view.detail-recommendations.index"
      }
    ],
    {
      "as": "profile.view.detail-recommendations"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/skills",
        "handler": "profile.view.detail-skills"
      },
      {
        "path": "/loading",
        "handler": "profile.view.detail-skills.loading"
      }
    ],
    {
      "as": "profile.view.detail-skills.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/skills",
        "handler": "profile.view.detail-skills"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-skills/:error",
        "handler": "profile.view.detail-skills.error"
      }
    ],
    {
      "as": "profile.view.detail-skills.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/skills",
        "handler": "profile.view.detail-skills"
      },
      {
        "path": "/:skillId",
        "handler": "profile.view.detail-skills.endorsers"
      }
    ],
    {
      "as": "profile.view.detail-skills.endorsers"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/skills",
        "handler": "profile.view.detail-skills"
      },
      {
        "path": "/pending",
        "handler": "profile.view.detail-skills.pending"
      }
    ],
    {
      "as": "profile.view.detail-skills.pending"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/skills",
        "handler": "profile.view.detail-skills"
      },
      {
        "path": "/",
        "handler": "profile.view.detail-skills.index"
      }
    ],
    {
      "as": "profile.view.detail-skills.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/skills",
        "handler": "profile.view.detail-skills"
      },
      {
        "path": "/",
        "handler": "profile.view.detail-skills.index"
      }
    ],
    {
      "as": "profile.view.detail-skills"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/summary",
        "handler": "profile.view.detail-summary"
      }
    ],
    {
      "as": "profile.view.detail-summary"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/testscores",
        "handler": "profile.view.detail-test-scores"
      }
    ],
    {
      "as": "profile.view.detail-test-scores"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/contact-info-edit",
        "handler": "profile.view.contact-info-edit"
      }
    ],
    {
      "as": "profile.view.contact-info-edit"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/highlights/company-in-your-network/:entityId",
        "handler": "profile.view.highlights-descriptive-company"
      }
    ],
    {
      "as": "profile.view.highlights-descriptive-company"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/highlights/region-in-your-network/:entityId",
        "handler": "profile.view.highlights-descriptive-region"
      }
    ],
    {
      "as": "profile.view.highlights-descriptive-region"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/highlights/school-in-your-network/:entityId",
        "handler": "profile.view.highlights-descriptive-school"
      }
    ],
    {
      "as": "profile.view.highlights-descriptive-school"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/highlights/senior-people-in-your-network/:entityId",
        "handler": "profile.view.highlights-descriptive-senior-company"
      }
    ],
    {
      "as": "profile.view.highlights-descriptive-senior-company"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/highlights/shared-groups",
        "handler": "profile.view.highlights-shared-groups"
      }
    ],
    {
      "as": "profile.view.highlights-shared-groups"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/patent/:patentId/contributors",
        "handler": "profile.view.patent-contributors"
      }
    ],
    {
      "as": "profile.view.patent-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/project/:projectId/contributors",
        "handler": "profile.view.project-contributors"
      }
    ],
    {
      "as": "profile.view.project-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/publication/:publicationId/contributors",
        "handler": "profile.view.publication-contributors"
      }
    ],
    {
      "as": "profile.view.publication-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/more",
        "handler": "profile.view.top-card-more"
      }
    ],
    {
      "as": "profile.view.top-card-more"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/topcard",
        "handler": "profile.view.topcard"
      }
    ],
    {
      "as": "profile.view.topcard"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/position/:positionId",
        "handler": "profile.view.position"
      }
    ],
    {
      "as": "profile.view.position"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/education/:educationId",
        "handler": "profile.view.education"
      }
    ],
    {
      "as": "profile.view.education"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/volunteer-experience/:volunteerExperienceId",
        "handler": "profile.view.volunteer-experience"
      }
    ],
    {
      "as": "profile.view.volunteer-experience"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/publication/:publicationId",
        "handler": "profile.view.publication"
      }
    ],
    {
      "as": "profile.view.publication"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/certification/:certificationId",
        "handler": "profile.view.certification"
      }
    ],
    {
      "as": "profile.view.certification"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/course/:courseId",
        "handler": "profile.view.course"
      }
    ],
    {
      "as": "profile.view.course"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/project/:projectId",
        "handler": "profile.view.project"
      }
    ],
    {
      "as": "profile.view.project"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/hub",
        "handler": "profile.view.hub"
      }
    ],
    {
      "as": "profile.view.hub"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/",
        "handler": "profile.view.index"
      }
    ],
    {
      "as": "profile.view.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId",
        "handler": "profile.view"
      },
      {
        "path": "/",
        "handler": "profile.view.index"
      }
    ],
    {
      "as": "profile.view"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/loading",
        "handler": "profile.view-lang.loading"
      }
    ],
    {
      "as": "profile.view-lang.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/_unused_dummy_error_path_route_view-lang/:error",
        "handler": "profile.view-lang.error"
      }
    ],
    {
      "as": "profile.view-lang.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/background",
        "handler": "profile.view-lang.detail-background"
      }
    ],
    {
      "as": "profile.view-lang.detail-background"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/certifications",
        "handler": "profile.view-lang.detail-certifications"
      }
    ],
    {
      "as": "profile.view-lang.detail-certifications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile.view-lang.detail-connections"
      },
      {
        "path": "/loading",
        "handler": "profile.view-lang.detail-connections.loading"
      }
    ],
    {
      "as": "profile.view-lang.detail-connections.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile.view-lang.detail-connections"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-connections/:error",
        "handler": "profile.view-lang.detail-connections.error"
      }
    ],
    {
      "as": "profile.view-lang.detail-connections.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile.view-lang.detail-connections"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.detail-connections.all"
      }
    ],
    {
      "as": "profile.view-lang.detail-connections.all"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile.view-lang.detail-connections"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.detail-connections.all"
      }
    ],
    {
      "as": "profile.view-lang.detail-connections"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile.view-lang.detail-connections"
      },
      {
        "path": "/shared",
        "handler": "profile.view-lang.detail-connections.shared"
      }
    ],
    {
      "as": "profile.view-lang.detail-connections.shared"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/contact-info",
        "handler": "profile.view-lang.detail-contact-info"
      }
    ],
    {
      "as": "profile.view-lang.detail-contact-info"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/courses",
        "handler": "profile.view-lang.detail-courses"
      }
    ],
    {
      "as": "profile.view-lang.detail-courses"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/honors",
        "handler": "profile.view-lang.detail-honors"
      }
    ],
    {
      "as": "profile.view-lang.detail-honors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recent-activity/interests/influencers",
        "handler": "profile.view-lang.detail-interests-all-influencers"
      }
    ],
    {
      "as": "profile.view-lang.detail-interests-all-influencers"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recent-activity/interests/companies",
        "handler": "profile.view-lang.detail-interests-all-companies"
      }
    ],
    {
      "as": "profile.view-lang.detail-interests-all-companies"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recent-activity/interests/schools",
        "handler": "profile.view-lang.detail-interests-all-schools"
      }
    ],
    {
      "as": "profile.view-lang.detail-interests-all-schools"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/patents",
        "handler": "profile.view-lang.detail-patents"
      }
    ],
    {
      "as": "profile.view-lang.detail-patents"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/projects",
        "handler": "profile.view-lang.detail-projects"
      }
    ],
    {
      "as": "profile.view-lang.detail-projects"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/publications",
        "handler": "profile.view-lang.detail-publications"
      }
    ],
    {
      "as": "profile.view-lang.detail-publications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view-lang.detail-recent-activity"
      },
      {
        "path": "/loading",
        "handler": "profile.view-lang.detail-recent-activity.loading"
      }
    ],
    {
      "as": "profile.view-lang.detail-recent-activity.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view-lang.detail-recent-activity"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-recent-activity/:error",
        "handler": "profile.view-lang.detail-recent-activity.error"
      }
    ],
    {
      "as": "profile.view-lang.detail-recent-activity.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view-lang.detail-recent-activity"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.detail-recent-activity.activity"
      }
    ],
    {
      "as": "profile.view-lang.detail-recent-activity.activity"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view-lang.detail-recent-activity"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.detail-recent-activity.activity"
      }
    ],
    {
      "as": "profile.view-lang.detail-recent-activity"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view-lang.detail-recent-activity"
      },
      {
        "path": "/posts",
        "handler": "profile.view-lang.detail-recent-activity.posts"
      }
    ],
    {
      "as": "profile.view-lang.detail-recent-activity.posts"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile.view-lang.detail-recent-activity"
      },
      {
        "path": "/interests",
        "handler": "profile.view-lang.detail-recent-activity.interests"
      }
    ],
    {
      "as": "profile.view-lang.detail-recent-activity.interests"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view-lang.detail-recommendations"
      },
      {
        "path": "/loading",
        "handler": "profile.view-lang.detail-recommendations.loading"
      }
    ],
    {
      "as": "profile.view-lang.detail-recommendations.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view-lang.detail-recommendations"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-recommendations/:error",
        "handler": "profile.view-lang.detail-recommendations.error"
      }
    ],
    {
      "as": "profile.view-lang.detail-recommendations.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view-lang.detail-recommendations"
      },
      {
        "path": "/received",
        "handler": "profile.view-lang.detail-recommendations.received"
      }
    ],
    {
      "as": "profile.view-lang.detail-recommendations.received"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view-lang.detail-recommendations"
      },
      {
        "path": "/given",
        "handler": "profile.view-lang.detail-recommendations.given"
      }
    ],
    {
      "as": "profile.view-lang.detail-recommendations.given"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view-lang.detail-recommendations"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.detail-recommendations.index"
      }
    ],
    {
      "as": "profile.view-lang.detail-recommendations.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile.view-lang.detail-recommendations"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.detail-recommendations.index"
      }
    ],
    {
      "as": "profile.view-lang.detail-recommendations"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile.view-lang.detail-skills"
      },
      {
        "path": "/loading",
        "handler": "profile.view-lang.detail-skills.loading"
      }
    ],
    {
      "as": "profile.view-lang.detail-skills.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile.view-lang.detail-skills"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-skills/:error",
        "handler": "profile.view-lang.detail-skills.error"
      }
    ],
    {
      "as": "profile.view-lang.detail-skills.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile.view-lang.detail-skills"
      },
      {
        "path": "/:skillId",
        "handler": "profile.view-lang.detail-skills.endorsers"
      }
    ],
    {
      "as": "profile.view-lang.detail-skills.endorsers"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile.view-lang.detail-skills"
      },
      {
        "path": "/pending",
        "handler": "profile.view-lang.detail-skills.pending"
      }
    ],
    {
      "as": "profile.view-lang.detail-skills.pending"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile.view-lang.detail-skills"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.detail-skills.index"
      }
    ],
    {
      "as": "profile.view-lang.detail-skills.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile.view-lang.detail-skills"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.detail-skills.index"
      }
    ],
    {
      "as": "profile.view-lang.detail-skills"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/summary",
        "handler": "profile.view-lang.detail-summary"
      }
    ],
    {
      "as": "profile.view-lang.detail-summary"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/testscores",
        "handler": "profile.view-lang.detail-test-scores"
      }
    ],
    {
      "as": "profile.view-lang.detail-test-scores"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/contact-info-edit",
        "handler": "profile.view-lang.contact-info-edit"
      }
    ],
    {
      "as": "profile.view-lang.contact-info-edit"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/highlights/company-in-your-network/:entityId",
        "handler": "profile.view-lang.highlights-descriptive-company"
      }
    ],
    {
      "as": "profile.view-lang.highlights-descriptive-company"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/highlights/region-in-your-network/:entityId",
        "handler": "profile.view-lang.highlights-descriptive-region"
      }
    ],
    {
      "as": "profile.view-lang.highlights-descriptive-region"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/highlights/school-in-your-network/:entityId",
        "handler": "profile.view-lang.highlights-descriptive-school"
      }
    ],
    {
      "as": "profile.view-lang.highlights-descriptive-school"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/highlights/senior-people-in-your-network/:entityId",
        "handler": "profile.view-lang.highlights-descriptive-senior-company"
      }
    ],
    {
      "as": "profile.view-lang.highlights-descriptive-senior-company"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/highlights/shared-groups",
        "handler": "profile.view-lang.highlights-shared-groups"
      }
    ],
    {
      "as": "profile.view-lang.highlights-shared-groups"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/patent/:patentId/contributors",
        "handler": "profile.view-lang.patent-contributors"
      }
    ],
    {
      "as": "profile.view-lang.patent-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/project/:projectId/contributors",
        "handler": "profile.view-lang.project-contributors"
      }
    ],
    {
      "as": "profile.view-lang.project-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/publication/:publicationId/contributors",
        "handler": "profile.view-lang.publication-contributors"
      }
    ],
    {
      "as": "profile.view-lang.publication-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/more",
        "handler": "profile.view-lang.top-card-more"
      }
    ],
    {
      "as": "profile.view-lang.top-card-more"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/topcard",
        "handler": "profile.view-lang.topcard"
      }
    ],
    {
      "as": "profile.view-lang.topcard"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/position/:positionId",
        "handler": "profile.view-lang.position"
      }
    ],
    {
      "as": "profile.view-lang.position"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/education/:educationId",
        "handler": "profile.view-lang.education"
      }
    ],
    {
      "as": "profile.view-lang.education"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/volunteer-experience/:volunteerExperienceId",
        "handler": "profile.view-lang.volunteer-experience"
      }
    ],
    {
      "as": "profile.view-lang.volunteer-experience"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/publication/:publicationId",
        "handler": "profile.view-lang.publication"
      }
    ],
    {
      "as": "profile.view-lang.publication"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/certification/:certificationId",
        "handler": "profile.view-lang.certification"
      }
    ],
    {
      "as": "profile.view-lang.certification"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/course/:courseId",
        "handler": "profile.view-lang.course"
      }
    ],
    {
      "as": "profile.view-lang.course"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/project/:projectId",
        "handler": "profile.view-lang.project"
      }
    ],
    {
      "as": "profile.view-lang.project"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/hub",
        "handler": "profile.view-lang.hub"
      }
    ],
    {
      "as": "profile.view-lang.hub"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.index"
      }
    ],
    {
      "as": "profile.view-lang.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile.view-lang"
      },
      {
        "path": "/",
        "handler": "profile.view-lang.index"
      }
    ],
    {
      "as": "profile.view-lang"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/edit",
        "handler": "profile.edit"
      },
      {
        "path": "/loading",
        "handler": "profile.edit.loading"
      }
    ],
    {
      "as": "profile.edit.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/edit",
        "handler": "profile.edit"
      },
      {
        "path": "/_unused_dummy_error_path_route_edit/:error",
        "handler": "profile.edit.error"
      }
    ],
    {
      "as": "profile.edit.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/edit",
        "handler": "profile.edit"
      },
      {
        "path": "/",
        "handler": "profile.edit.index"
      }
    ],
    {
      "as": "profile.edit.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/edit",
        "handler": "profile.edit"
      },
      {
        "path": "/",
        "handler": "profile.edit.index"
      }
    ],
    {
      "as": "profile.edit"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/edit",
        "handler": "profile.edit"
      },
      {
        "path": "/skills",
        "handler": "profile.edit.skills"
      }
    ],
    {
      "as": "profile.edit.skills"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/guided",
        "handler": "profile.guided"
      },
      {
        "path": "/loading",
        "handler": "profile.guided.loading"
      }
    ],
    {
      "as": "profile.guided.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/guided",
        "handler": "profile.guided"
      },
      {
        "path": "/_unused_dummy_error_path_route_guided/:error",
        "handler": "profile.guided.error"
      }
    ],
    {
      "as": "profile.guided.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/guided",
        "handler": "profile.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile.guided.category"
      },
      {
        "path": "/loading",
        "handler": "profile.guided.category.loading"
      }
    ],
    {
      "as": "profile.guided.category.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/guided",
        "handler": "profile.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile.guided.category"
      },
      {
        "path": "/_unused_dummy_error_path_route_category/:error",
        "handler": "profile.guided.category.error"
      }
    ],
    {
      "as": "profile.guided.category.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/guided",
        "handler": "profile.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile.guided.category"
      },
      {
        "path": "/:taskId",
        "handler": "profile.guided.category.task"
      }
    ],
    {
      "as": "profile.guided.category.task"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/guided",
        "handler": "profile.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile.guided.category"
      },
      {
        "path": "/",
        "handler": "profile.guided.category.index"
      }
    ],
    {
      "as": "profile.guided.category.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/guided",
        "handler": "profile.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile.guided.category"
      },
      {
        "path": "/",
        "handler": "profile.guided.category.index"
      }
    ],
    {
      "as": "profile.guided.category"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/guided",
        "handler": "profile.guided"
      },
      {
        "path": "/",
        "handler": "profile.guided.index"
      }
    ],
    {
      "as": "profile.guided.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/guided",
        "handler": "profile.guided"
      },
      {
        "path": "/",
        "handler": "profile.guided.index"
      }
    ],
    {
      "as": "profile.guided"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/pendingEndorsements",
        "handler": "profile.pending-endorsements"
      }
    ],
    {
      "as": "profile.pending-endorsements"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/restricted",
        "handler": "profile.aasaan-error"
      }
    ],
    {
      "as": "profile.aasaan-error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/unavailable",
        "handler": "profile.unavailable"
      }
    ],
    {
      "as": "profile.unavailable"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/view",
        "handler": "profile.profile-query-param"
      }
    ],
    {
      "as": "profile.profile-query-param"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/",
        "handler": "profile.index"
      }
    ],
    {
      "as": "profile.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/profile",
        "handler": "profile"
      },
      {
        "path": "/",
        "handler": "profile.index"
      }
    ],
    {
      "as": "profile"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.loading"
      }
    ],
    {
      "as": "profile-vanity.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/_unused_dummy_error_path_route_profile-vanity/:error",
        "handler": "profile-vanity.error"
      }
    ],
    {
      "as": "profile-vanity.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view.loading"
      }
    ],
    {
      "as": "profile-vanity.view.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/_unused_dummy_error_path_route_view/:error",
        "handler": "profile-vanity.view.error"
      }
    ],
    {
      "as": "profile-vanity.view.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/background",
        "handler": "profile-vanity.view.detail-background"
      }
    ],
    {
      "as": "profile-vanity.view.detail-background"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/certifications",
        "handler": "profile-vanity.view.detail-certifications"
      }
    ],
    {
      "as": "profile-vanity.view.detail-certifications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view.detail-connections"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view.detail-connections.loading"
      }
    ],
    {
      "as": "profile-vanity.view.detail-connections.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view.detail-connections"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-connections/:error",
        "handler": "profile-vanity.view.detail-connections.error"
      }
    ],
    {
      "as": "profile-vanity.view.detail-connections.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view.detail-connections"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.detail-connections.all"
      }
    ],
    {
      "as": "profile-vanity.view.detail-connections.all"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view.detail-connections"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.detail-connections.all"
      }
    ],
    {
      "as": "profile-vanity.view.detail-connections"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view.detail-connections"
      },
      {
        "path": "/shared",
        "handler": "profile-vanity.view.detail-connections.shared"
      }
    ],
    {
      "as": "profile-vanity.view.detail-connections.shared"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/contact-info",
        "handler": "profile-vanity.view.detail-contact-info"
      }
    ],
    {
      "as": "profile-vanity.view.detail-contact-info"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/courses",
        "handler": "profile-vanity.view.detail-courses"
      }
    ],
    {
      "as": "profile-vanity.view.detail-courses"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/honors",
        "handler": "profile-vanity.view.detail-honors"
      }
    ],
    {
      "as": "profile-vanity.view.detail-honors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recent-activity/interests/influencers",
        "handler": "profile-vanity.view.detail-interests-all-influencers"
      }
    ],
    {
      "as": "profile-vanity.view.detail-interests-all-influencers"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recent-activity/interests/companies",
        "handler": "profile-vanity.view.detail-interests-all-companies"
      }
    ],
    {
      "as": "profile-vanity.view.detail-interests-all-companies"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recent-activity/interests/schools",
        "handler": "profile-vanity.view.detail-interests-all-schools"
      }
    ],
    {
      "as": "profile-vanity.view.detail-interests-all-schools"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/patents",
        "handler": "profile-vanity.view.detail-patents"
      }
    ],
    {
      "as": "profile-vanity.view.detail-patents"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/projects",
        "handler": "profile-vanity.view.detail-projects"
      }
    ],
    {
      "as": "profile-vanity.view.detail-projects"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/publications",
        "handler": "profile-vanity.view.detail-publications"
      }
    ],
    {
      "as": "profile-vanity.view.detail-publications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view.detail-recent-activity"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view.detail-recent-activity.loading"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recent-activity.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view.detail-recent-activity"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-recent-activity/:error",
        "handler": "profile-vanity.view.detail-recent-activity.error"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recent-activity.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view.detail-recent-activity"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.detail-recent-activity.activity"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recent-activity.activity"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view.detail-recent-activity"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.detail-recent-activity.activity"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recent-activity"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view.detail-recent-activity"
      },
      {
        "path": "/posts",
        "handler": "profile-vanity.view.detail-recent-activity.posts"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recent-activity.posts"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view.detail-recent-activity"
      },
      {
        "path": "/interests",
        "handler": "profile-vanity.view.detail-recent-activity.interests"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recent-activity.interests"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view.detail-recommendations"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view.detail-recommendations.loading"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recommendations.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view.detail-recommendations"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-recommendations/:error",
        "handler": "profile-vanity.view.detail-recommendations.error"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recommendations.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view.detail-recommendations"
      },
      {
        "path": "/received",
        "handler": "profile-vanity.view.detail-recommendations.received"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recommendations.received"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view.detail-recommendations"
      },
      {
        "path": "/given",
        "handler": "profile-vanity.view.detail-recommendations.given"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recommendations.given"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view.detail-recommendations"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.detail-recommendations.index"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recommendations.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view.detail-recommendations"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.detail-recommendations.index"
      }
    ],
    {
      "as": "profile-vanity.view.detail-recommendations"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view.detail-skills"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view.detail-skills.loading"
      }
    ],
    {
      "as": "profile-vanity.view.detail-skills.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view.detail-skills"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-skills/:error",
        "handler": "profile-vanity.view.detail-skills.error"
      }
    ],
    {
      "as": "profile-vanity.view.detail-skills.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view.detail-skills"
      },
      {
        "path": "/:skillId",
        "handler": "profile-vanity.view.detail-skills.endorsers"
      }
    ],
    {
      "as": "profile-vanity.view.detail-skills.endorsers"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view.detail-skills"
      },
      {
        "path": "/pending",
        "handler": "profile-vanity.view.detail-skills.pending"
      }
    ],
    {
      "as": "profile-vanity.view.detail-skills.pending"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view.detail-skills"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.detail-skills.index"
      }
    ],
    {
      "as": "profile-vanity.view.detail-skills.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view.detail-skills"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.detail-skills.index"
      }
    ],
    {
      "as": "profile-vanity.view.detail-skills"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/summary",
        "handler": "profile-vanity.view.detail-summary"
      }
    ],
    {
      "as": "profile-vanity.view.detail-summary"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/testscores",
        "handler": "profile-vanity.view.detail-test-scores"
      }
    ],
    {
      "as": "profile-vanity.view.detail-test-scores"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/contact-info-edit",
        "handler": "profile-vanity.view.contact-info-edit"
      }
    ],
    {
      "as": "profile-vanity.view.contact-info-edit"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/highlights/company-in-your-network/:entityId",
        "handler": "profile-vanity.view.highlights-descriptive-company"
      }
    ],
    {
      "as": "profile-vanity.view.highlights-descriptive-company"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/highlights/region-in-your-network/:entityId",
        "handler": "profile-vanity.view.highlights-descriptive-region"
      }
    ],
    {
      "as": "profile-vanity.view.highlights-descriptive-region"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/highlights/school-in-your-network/:entityId",
        "handler": "profile-vanity.view.highlights-descriptive-school"
      }
    ],
    {
      "as": "profile-vanity.view.highlights-descriptive-school"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/highlights/senior-people-in-your-network/:entityId",
        "handler": "profile-vanity.view.highlights-descriptive-senior-company"
      }
    ],
    {
      "as": "profile-vanity.view.highlights-descriptive-senior-company"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/highlights/shared-groups",
        "handler": "profile-vanity.view.highlights-shared-groups"
      }
    ],
    {
      "as": "profile-vanity.view.highlights-shared-groups"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/patent/:patentId/contributors",
        "handler": "profile-vanity.view.patent-contributors"
      }
    ],
    {
      "as": "profile-vanity.view.patent-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/project/:projectId/contributors",
        "handler": "profile-vanity.view.project-contributors"
      }
    ],
    {
      "as": "profile-vanity.view.project-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/publication/:publicationId/contributors",
        "handler": "profile-vanity.view.publication-contributors"
      }
    ],
    {
      "as": "profile-vanity.view.publication-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/more",
        "handler": "profile-vanity.view.top-card-more"
      }
    ],
    {
      "as": "profile-vanity.view.top-card-more"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/topcard",
        "handler": "profile-vanity.view.topcard"
      }
    ],
    {
      "as": "profile-vanity.view.topcard"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/position/:positionId",
        "handler": "profile-vanity.view.position"
      }
    ],
    {
      "as": "profile-vanity.view.position"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/education/:educationId",
        "handler": "profile-vanity.view.education"
      }
    ],
    {
      "as": "profile-vanity.view.education"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/volunteer-experience/:volunteerExperienceId",
        "handler": "profile-vanity.view.volunteer-experience"
      }
    ],
    {
      "as": "profile-vanity.view.volunteer-experience"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/publication/:publicationId",
        "handler": "profile-vanity.view.publication"
      }
    ],
    {
      "as": "profile-vanity.view.publication"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/certification/:certificationId",
        "handler": "profile-vanity.view.certification"
      }
    ],
    {
      "as": "profile-vanity.view.certification"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/course/:courseId",
        "handler": "profile-vanity.view.course"
      }
    ],
    {
      "as": "profile-vanity.view.course"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/project/:projectId",
        "handler": "profile-vanity.view.project"
      }
    ],
    {
      "as": "profile-vanity.view.project"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/hub",
        "handler": "profile-vanity.view.hub"
      }
    ],
    {
      "as": "profile-vanity.view.hub"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.index"
      }
    ],
    {
      "as": "profile-vanity.view.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId",
        "handler": "profile-vanity.view"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view.index"
      }
    ],
    {
      "as": "profile-vanity.view"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view-lang.loading"
      }
    ],
    {
      "as": "profile-vanity.view-lang.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/_unused_dummy_error_path_route_view-lang/:error",
        "handler": "profile-vanity.view-lang.error"
      }
    ],
    {
      "as": "profile-vanity.view-lang.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/background",
        "handler": "profile-vanity.view-lang.detail-background"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-background"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/certifications",
        "handler": "profile-vanity.view-lang.detail-certifications"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-certifications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view-lang.detail-connections"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view-lang.detail-connections.loading"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-connections.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view-lang.detail-connections"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-connections/:error",
        "handler": "profile-vanity.view-lang.detail-connections.error"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-connections.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view-lang.detail-connections"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.detail-connections.all"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-connections.all"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view-lang.detail-connections"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.detail-connections.all"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-connections"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/connections",
        "handler": "profile-vanity.view-lang.detail-connections"
      },
      {
        "path": "/shared",
        "handler": "profile-vanity.view-lang.detail-connections.shared"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-connections.shared"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/contact-info",
        "handler": "profile-vanity.view-lang.detail-contact-info"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-contact-info"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/courses",
        "handler": "profile-vanity.view-lang.detail-courses"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-courses"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/honors",
        "handler": "profile-vanity.view-lang.detail-honors"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-honors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recent-activity/interests/influencers",
        "handler": "profile-vanity.view-lang.detail-interests-all-influencers"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-interests-all-influencers"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recent-activity/interests/companies",
        "handler": "profile-vanity.view-lang.detail-interests-all-companies"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-interests-all-companies"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recent-activity/interests/schools",
        "handler": "profile-vanity.view-lang.detail-interests-all-schools"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-interests-all-schools"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/patents",
        "handler": "profile-vanity.view-lang.detail-patents"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-patents"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/projects",
        "handler": "profile-vanity.view-lang.detail-projects"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-projects"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/publications",
        "handler": "profile-vanity.view-lang.detail-publications"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-publications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view-lang.detail-recent-activity"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view-lang.detail-recent-activity.loading"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recent-activity.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view-lang.detail-recent-activity"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-recent-activity/:error",
        "handler": "profile-vanity.view-lang.detail-recent-activity.error"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recent-activity.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view-lang.detail-recent-activity"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.detail-recent-activity.activity"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recent-activity.activity"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view-lang.detail-recent-activity"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.detail-recent-activity.activity"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recent-activity"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view-lang.detail-recent-activity"
      },
      {
        "path": "/posts",
        "handler": "profile-vanity.view-lang.detail-recent-activity.posts"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recent-activity.posts"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recent-activity",
        "handler": "profile-vanity.view-lang.detail-recent-activity"
      },
      {
        "path": "/interests",
        "handler": "profile-vanity.view-lang.detail-recent-activity.interests"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recent-activity.interests"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view-lang.detail-recommendations"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view-lang.detail-recommendations.loading"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recommendations.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view-lang.detail-recommendations"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-recommendations/:error",
        "handler": "profile-vanity.view-lang.detail-recommendations.error"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recommendations.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view-lang.detail-recommendations"
      },
      {
        "path": "/received",
        "handler": "profile-vanity.view-lang.detail-recommendations.received"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recommendations.received"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view-lang.detail-recommendations"
      },
      {
        "path": "/given",
        "handler": "profile-vanity.view-lang.detail-recommendations.given"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recommendations.given"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view-lang.detail-recommendations"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.detail-recommendations.index"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recommendations.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/recommendations",
        "handler": "profile-vanity.view-lang.detail-recommendations"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.detail-recommendations.index"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-recommendations"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view-lang.detail-skills"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.view-lang.detail-skills.loading"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-skills.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view-lang.detail-skills"
      },
      {
        "path": "/_unused_dummy_error_path_route_detail-skills/:error",
        "handler": "profile-vanity.view-lang.detail-skills.error"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-skills.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view-lang.detail-skills"
      },
      {
        "path": "/:skillId",
        "handler": "profile-vanity.view-lang.detail-skills.endorsers"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-skills.endorsers"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view-lang.detail-skills"
      },
      {
        "path": "/pending",
        "handler": "profile-vanity.view-lang.detail-skills.pending"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-skills.pending"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view-lang.detail-skills"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.detail-skills.index"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-skills.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.view-lang.detail-skills"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.detail-skills.index"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-skills"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/summary",
        "handler": "profile-vanity.view-lang.detail-summary"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-summary"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/testscores",
        "handler": "profile-vanity.view-lang.detail-test-scores"
      }
    ],
    {
      "as": "profile-vanity.view-lang.detail-test-scores"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/contact-info-edit",
        "handler": "profile-vanity.view-lang.contact-info-edit"
      }
    ],
    {
      "as": "profile-vanity.view-lang.contact-info-edit"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/highlights/company-in-your-network/:entityId",
        "handler": "profile-vanity.view-lang.highlights-descriptive-company"
      }
    ],
    {
      "as": "profile-vanity.view-lang.highlights-descriptive-company"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/highlights/region-in-your-network/:entityId",
        "handler": "profile-vanity.view-lang.highlights-descriptive-region"
      }
    ],
    {
      "as": "profile-vanity.view-lang.highlights-descriptive-region"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/highlights/school-in-your-network/:entityId",
        "handler": "profile-vanity.view-lang.highlights-descriptive-school"
      }
    ],
    {
      "as": "profile-vanity.view-lang.highlights-descriptive-school"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/highlights/senior-people-in-your-network/:entityId",
        "handler": "profile-vanity.view-lang.highlights-descriptive-senior-company"
      }
    ],
    {
      "as": "profile-vanity.view-lang.highlights-descriptive-senior-company"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/highlights/shared-groups",
        "handler": "profile-vanity.view-lang.highlights-shared-groups"
      }
    ],
    {
      "as": "profile-vanity.view-lang.highlights-shared-groups"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/patent/:patentId/contributors",
        "handler": "profile-vanity.view-lang.patent-contributors"
      }
    ],
    {
      "as": "profile-vanity.view-lang.patent-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/project/:projectId/contributors",
        "handler": "profile-vanity.view-lang.project-contributors"
      }
    ],
    {
      "as": "profile-vanity.view-lang.project-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/publication/:publicationId/contributors",
        "handler": "profile-vanity.view-lang.publication-contributors"
      }
    ],
    {
      "as": "profile-vanity.view-lang.publication-contributors"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/more",
        "handler": "profile-vanity.view-lang.top-card-more"
      }
    ],
    {
      "as": "profile-vanity.view-lang.top-card-more"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/topcard",
        "handler": "profile-vanity.view-lang.topcard"
      }
    ],
    {
      "as": "profile-vanity.view-lang.topcard"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/position/:positionId",
        "handler": "profile-vanity.view-lang.position"
      }
    ],
    {
      "as": "profile-vanity.view-lang.position"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/education/:educationId",
        "handler": "profile-vanity.view-lang.education"
      }
    ],
    {
      "as": "profile-vanity.view-lang.education"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/volunteer-experience/:volunteerExperienceId",
        "handler": "profile-vanity.view-lang.volunteer-experience"
      }
    ],
    {
      "as": "profile-vanity.view-lang.volunteer-experience"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/publication/:publicationId",
        "handler": "profile-vanity.view-lang.publication"
      }
    ],
    {
      "as": "profile-vanity.view-lang.publication"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/certification/:certificationId",
        "handler": "profile-vanity.view-lang.certification"
      }
    ],
    {
      "as": "profile-vanity.view-lang.certification"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/course/:courseId",
        "handler": "profile-vanity.view-lang.course"
      }
    ],
    {
      "as": "profile-vanity.view-lang.course"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/project/:projectId",
        "handler": "profile-vanity.view-lang.project"
      }
    ],
    {
      "as": "profile-vanity.view-lang.project"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/hub",
        "handler": "profile-vanity.view-lang.hub"
      }
    ],
    {
      "as": "profile-vanity.view-lang.hub"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.index"
      }
    ],
    {
      "as": "profile-vanity.view-lang.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/:memberId/:langCode",
        "handler": "profile-vanity.view-lang"
      },
      {
        "path": "/",
        "handler": "profile-vanity.view-lang.index"
      }
    ],
    {
      "as": "profile-vanity.view-lang"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/edit",
        "handler": "profile-vanity.edit"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.edit.loading"
      }
    ],
    {
      "as": "profile-vanity.edit.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/edit",
        "handler": "profile-vanity.edit"
      },
      {
        "path": "/_unused_dummy_error_path_route_edit/:error",
        "handler": "profile-vanity.edit.error"
      }
    ],
    {
      "as": "profile-vanity.edit.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/edit",
        "handler": "profile-vanity.edit"
      },
      {
        "path": "/",
        "handler": "profile-vanity.edit.index"
      }
    ],
    {
      "as": "profile-vanity.edit.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/edit",
        "handler": "profile-vanity.edit"
      },
      {
        "path": "/",
        "handler": "profile-vanity.edit.index"
      }
    ],
    {
      "as": "profile-vanity.edit"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/edit",
        "handler": "profile-vanity.edit"
      },
      {
        "path": "/skills",
        "handler": "profile-vanity.edit.skills"
      }
    ],
    {
      "as": "profile-vanity.edit.skills"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/guided",
        "handler": "profile-vanity.guided"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.guided.loading"
      }
    ],
    {
      "as": "profile-vanity.guided.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/guided",
        "handler": "profile-vanity.guided"
      },
      {
        "path": "/_unused_dummy_error_path_route_guided/:error",
        "handler": "profile-vanity.guided.error"
      }
    ],
    {
      "as": "profile-vanity.guided.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/guided",
        "handler": "profile-vanity.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile-vanity.guided.category"
      },
      {
        "path": "/loading",
        "handler": "profile-vanity.guided.category.loading"
      }
    ],
    {
      "as": "profile-vanity.guided.category.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/guided",
        "handler": "profile-vanity.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile-vanity.guided.category"
      },
      {
        "path": "/_unused_dummy_error_path_route_category/:error",
        "handler": "profile-vanity.guided.category.error"
      }
    ],
    {
      "as": "profile-vanity.guided.category.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/guided",
        "handler": "profile-vanity.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile-vanity.guided.category"
      },
      {
        "path": "/:taskId",
        "handler": "profile-vanity.guided.category.task"
      }
    ],
    {
      "as": "profile-vanity.guided.category.task"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/guided",
        "handler": "profile-vanity.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile-vanity.guided.category"
      },
      {
        "path": "/",
        "handler": "profile-vanity.guided.category.index"
      }
    ],
    {
      "as": "profile-vanity.guided.category.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/guided",
        "handler": "profile-vanity.guided"
      },
      {
        "path": "/:categoryId",
        "handler": "profile-vanity.guided.category"
      },
      {
        "path": "/",
        "handler": "profile-vanity.guided.category.index"
      }
    ],
    {
      "as": "profile-vanity.guided.category"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/guided",
        "handler": "profile-vanity.guided"
      },
      {
        "path": "/",
        "handler": "profile-vanity.guided.index"
      }
    ],
    {
      "as": "profile-vanity.guided.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/guided",
        "handler": "profile-vanity.guided"
      },
      {
        "path": "/",
        "handler": "profile-vanity.guided.index"
      }
    ],
    {
      "as": "profile-vanity.guided"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/pendingEndorsements",
        "handler": "profile-vanity.pending-endorsements"
      }
    ],
    {
      "as": "profile-vanity.pending-endorsements"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/restricted",
        "handler": "profile-vanity.aasaan-error"
      }
    ],
    {
      "as": "profile-vanity.aasaan-error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/unavailable",
        "handler": "profile-vanity.unavailable"
      }
    ],
    {
      "as": "profile-vanity.unavailable"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/view",
        "handler": "profile-vanity.profile-query-param"
      }
    ],
    {
      "as": "profile-vanity.profile-query-param"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/",
        "handler": "profile-vanity.index"
      }
    ],
    {
      "as": "profile-vanity.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/in",
        "handler": "profile-vanity"
      },
      {
        "path": "/",
        "handler": "profile-vanity.index"
      }
    ],
    {
      "as": "profile-vanity"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/comm/in/:vanityName",
        "handler": "comm-in"
      }
    ],
    {
      "as": "comm-in"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/me",
        "handler": "me"
      },
      {
        "path": "/loading",
        "handler": "me.loading"
      }
    ],
    {
      "as": "me.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/me",
        "handler": "me"
      },
      {
        "path": "/_unused_dummy_error_path_route_me/:error",
        "handler": "me.error"
      }
    ],
    {
      "as": "me.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/me",
        "handler": "me"
      },
      {
        "path": "/profile-views",
        "handler": "me.profile-views"
      }
    ],
    {
      "as": "me.profile-views"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/me",
        "handler": "me"
      },
      {
        "path": "/:actors",
        "handler": "me.actor-list"
      }
    ],
    {
      "as": "me.actor-list"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/me",
        "handler": "me"
      },
      {
        "path": "/learn-more",
        "handler": "me.learn-more"
      }
    ],
    {
      "as": "me.learn-more"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/me",
        "handler": "me"
      },
      {
        "path": "/",
        "handler": "me.index"
      }
    ],
    {
      "as": "me.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/me",
        "handler": "me"
      },
      {
        "path": "/",
        "handler": "me.index"
      }
    ],
    {
      "as": "me"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/notifications",
        "handler": "notifications"
      },
      {
        "path": "/loading",
        "handler": "notifications.loading"
      }
    ],
    {
      "as": "notifications.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/notifications",
        "handler": "notifications"
      },
      {
        "path": "/_unused_dummy_error_path_route_notifications/:error",
        "handler": "notifications.error"
      }
    ],
    {
      "as": "notifications.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/notifications",
        "handler": "notifications"
      },
      {
        "path": "/",
        "handler": "notifications.index"
      }
    ],
    {
      "as": "notifications.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/notifications",
        "handler": "notifications"
      },
      {
        "path": "/",
        "handler": "notifications.index"
      }
    ],
    {
      "as": "notifications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/loading",
        "handler": "messaging.loading"
      }
    ],
    {
      "as": "messaging.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/_unused_dummy_error_path_route_messaging/:error",
        "handler": "messaging.error"
      }
    ],
    {
      "as": "messaging.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/thread/:conversationId",
        "handler": "messaging.thread"
      },
      {
        "path": "/loading",
        "handler": "messaging.thread.loading"
      }
    ],
    {
      "as": "messaging.thread.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/thread/:conversationId",
        "handler": "messaging.thread"
      },
      {
        "path": "/_unused_dummy_error_path_route_thread/:error",
        "handler": "messaging.thread.error"
      }
    ],
    {
      "as": "messaging.thread.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/thread/:conversationId",
        "handler": "messaging.thread"
      },
      {
        "path": "/topcard",
        "handler": "messaging.thread.topcard"
      }
    ],
    {
      "as": "messaging.thread.topcard"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/thread/:conversationId",
        "handler": "messaging.thread"
      },
      {
        "path": "/topcard-group",
        "handler": "messaging.thread.topcard-group"
      }
    ],
    {
      "as": "messaging.thread.topcard-group"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/thread/:conversationId",
        "handler": "messaging.thread"
      },
      {
        "path": "/",
        "handler": "messaging.thread.index"
      }
    ],
    {
      "as": "messaging.thread.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/thread/:conversationId",
        "handler": "messaging.thread"
      },
      {
        "path": "/",
        "handler": "messaging.thread.index"
      }
    ],
    {
      "as": "messaging.thread"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/compose",
        "handler": "messaging.compose"
      }
    ],
    {
      "as": "messaging.compose"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/compose/:recipient/body/:body",
        "handler": "messaging.compose-deeplink"
      }
    ],
    {
      "as": "messaging.compose-deeplink"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/compose/body/:body",
        "handler": "messaging.compose-deeplink"
      }
    ],
    {
      "as": "messaging.compose-deeplink"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/compose/:recipient",
        "handler": "messaging.compose-deeplink"
      }
    ],
    {
      "as": "messaging.compose-deeplink"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/search",
        "handler": "messaging.search"
      }
    ],
    {
      "as": "messaging.search"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/",
        "handler": "messaging.index"
      }
    ],
    {
      "as": "messaging.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/messaging",
        "handler": "messaging"
      },
      {
        "path": "/",
        "handler": "messaging.index"
      }
    ],
    {
      "as": "messaging"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/loading",
        "handler": "connected.loading"
      }
    ],
    {
      "as": "connected.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/_unused_dummy_error_path_route_connected/:error",
        "handler": "connected.error"
      }
    ],
    {
      "as": "connected.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-connect",
        "handler": "connected.invite-connect"
      },
      {
        "path": "/loading",
        "handler": "connected.invite-connect.loading"
      }
    ],
    {
      "as": "connected.invite-connect.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-connect",
        "handler": "connected.invite-connect"
      },
      {
        "path": "/_unused_dummy_error_path_route_invite-connect/:error",
        "handler": "connected.invite-connect.error"
      }
    ],
    {
      "as": "connected.invite-connect.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-connect",
        "handler": "connected.invite-connect"
      },
      {
        "path": "/invitations",
        "handler": "connected.invite-connect.invitations"
      },
      {
        "path": "/loading",
        "handler": "connected.invite-connect.invitations.loading"
      }
    ],
    {
      "as": "connected.invite-connect.invitations.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-connect",
        "handler": "connected.invite-connect"
      },
      {
        "path": "/invitations",
        "handler": "connected.invite-connect.invitations"
      },
      {
        "path": "/_unused_dummy_error_path_route_invitations/:error",
        "handler": "connected.invite-connect.invitations.error"
      }
    ],
    {
      "as": "connected.invite-connect.invitations.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-connect",
        "handler": "connected.invite-connect"
      },
      {
        "path": "/invitations",
        "handler": "connected.invite-connect.invitations"
      },
      {
        "path": "/",
        "handler": "connected.invite-connect.invitations.pending"
      }
    ],
    {
      "as": "connected.invite-connect.invitations.pending"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-connect",
        "handler": "connected.invite-connect"
      },
      {
        "path": "/invitations",
        "handler": "connected.invite-connect.invitations"
      },
      {
        "path": "/",
        "handler": "connected.invite-connect.invitations.pending"
      }
    ],
    {
      "as": "connected.invite-connect.invitations"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-connect",
        "handler": "connected.invite-connect"
      },
      {
        "path": "/connections",
        "handler": "connected.invite-connect.connections"
      }
    ],
    {
      "as": "connected.invite-connect.connections"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-connect",
        "handler": "connected.invite-connect"
      },
      {
        "path": "/",
        "handler": "connected.invite-connect.index"
      }
    ],
    {
      "as": "connected.invite-connect.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-connect",
        "handler": "connected.invite-connect"
      },
      {
        "path": "/",
        "handler": "connected.invite-connect.index"
      }
    ],
    {
      "as": "connected.invite-connect"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-accept/invitationId/:invitationId/sharedKey/:sharedKey",
        "handler": "connected.invite-accept"
      }
    ],
    {
      "as": "connected.invite-accept"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-accepted/actorId/:actorId",
        "handler": "connected.invite-accepted"
      }
    ],
    {
      "as": "connected.invite-accepted"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/invite-sent/:profileId",
        "handler": "connected.invite-sent"
      }
    ],
    {
      "as": "connected.invite-sent"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/add-connections",
        "handler": "connected.add-connections"
      }
    ],
    {
      "as": "connected.add-connections"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/update/:updateId/",
        "handler": "connected.update"
      }
    ],
    {
      "as": "connected.update"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/",
        "handler": "connected.index"
      }
    ],
    {
      "as": "connected.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/mynetwork",
        "handler": "connected"
      },
      {
        "path": "/",
        "handler": "connected.index"
      }
    ],
    {
      "as": "connected"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/loading",
        "handler": "search.loading"
      }
    ],
    {
      "as": "search.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/_unused_dummy_error_path_route_search/:error",
        "handler": "search.error"
      }
    ],
    {
      "as": "search.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/loading",
        "handler": "search.results.loading"
      }
    ],
    {
      "as": "search.results.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/_unused_dummy_error_path_route_results/:error",
        "handler": "search.results.error"
      }
    ],
    {
      "as": "search.results.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/index",
        "handler": "search.results.index"
      }
    ],
    {
      "as": "search.results.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/index",
        "handler": "search.results.index"
      }
    ],
    {
      "as": "search.results"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/jobs",
        "handler": "search.results.jobs"
      }
    ],
    {
      "as": "search.results.jobs"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/companies",
        "handler": "search.results.companies"
      }
    ],
    {
      "as": "search.results.companies"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/groups",
        "handler": "search.results.groups"
      }
    ],
    {
      "as": "search.results.groups"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/schools",
        "handler": "search.results.schools"
      }
    ],
    {
      "as": "search.results.schools"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/people",
        "handler": "search.results.people"
      }
    ],
    {
      "as": "search.results.people"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/articles",
        "handler": "search.results.articles"
      }
    ],
    {
      "as": "search.results.articles"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/results",
        "handler": "search.results"
      },
      {
        "path": "/feed-updates",
        "handler": "search.results.feed-updates"
      }
    ],
    {
      "as": "search.results.feed-updates"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/filters",
        "handler": "search.filters"
      }
    ],
    {
      "as": "search.filters"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/",
        "handler": "search.index"
      }
    ],
    {
      "as": "search.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/search",
        "handler": "search"
      },
      {
        "path": "/",
        "handler": "search.index"
      }
    ],
    {
      "as": "search"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId",
        "handler": "entities-company"
      },
      {
        "path": "/loading",
        "handler": "entities-company.loading"
      }
    ],
    {
      "as": "entities-company.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId",
        "handler": "entities-company"
      },
      {
        "path": "/_unused_dummy_error_path_route_entities-company/:error",
        "handler": "entities-company.error"
      }
    ],
    {
      "as": "entities-company.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId",
        "handler": "entities-company"
      },
      {
        "path": "/",
        "handler": "entities-company.highlights"
      }
    ],
    {
      "as": "entities-company.highlights"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId",
        "handler": "entities-company"
      },
      {
        "path": "/",
        "handler": "entities-company.highlights"
      }
    ],
    {
      "as": "entities-company"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId",
        "handler": "entities-company"
      },
      {
        "path": "/careers",
        "handler": "entities-company.careers"
      }
    ],
    {
      "as": "entities-company.careers"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId",
        "handler": "entities-company"
      },
      {
        "path": "/details",
        "handler": "entities-company.details"
      }
    ],
    {
      "as": "entities-company.details"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId/all-jobs",
        "handler": "entities-company-all-jobs"
      }
    ],
    {
      "as": "entities-company-all-jobs"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId/all-matched-jobs",
        "handler": "entities-company-all-matched-jobs"
      }
    ],
    {
      "as": "entities-company-all-matched-jobs"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId/all-showcases",
        "handler": "entities-company-all-showcases"
      }
    ],
    {
      "as": "entities-company-all-showcases"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId/all-in-common-people",
        "handler": "entities-company-all-in-common-people"
      }
    ],
    {
      "as": "entities-company-all-in-common-people"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId/all-employees",
        "handler": "entities-company-all-employees"
      }
    ],
    {
      "as": "entities-company-all-employees"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/company/:companyId/all-updates",
        "handler": "entities-company-all-updates"
      }
    ],
    {
      "as": "entities-company-all-updates"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/job/:jobId",
        "handler": "entities-job"
      }
    ],
    {
      "as": "entities-job"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/job/:jobId/description",
        "handler": "entities-job-description"
      }
    ],
    {
      "as": "entities-job-description"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/job/home",
        "handler": "entities-jymbii"
      }
    ],
    {
      "as": "entities-jymbii"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/job/:jobId/all-immediate-connections",
        "handler": "entities-job-all-immediate-connections"
      }
    ],
    {
      "as": "entities-job-all-immediate-connections"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/job/:jobId/all-in-common-with-job-poster",
        "handler": "entities-job-all-in-common-with-job-poster"
      }
    ],
    {
      "as": "entities-job-all-in-common-with-job-poster"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/job/:jobId/all-school-recruits/school/:schoolId/company/:companyId",
        "handler": "entities-job-all-school-recruits"
      }
    ],
    {
      "as": "entities-job-all-school-recruits"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/job/:jobId/all-company-recruits/company/:companyId/currentCompany/:currentCompanyId",
        "handler": "entities-job-all-company-recruits"
      }
    ],
    {
      "as": "entities-job-all-company-recruits"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/school/:schoolId",
        "handler": "entities-school"
      },
      {
        "path": "/loading",
        "handler": "entities-school.loading"
      }
    ],
    {
      "as": "entities-school.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/school/:schoolId",
        "handler": "entities-school"
      },
      {
        "path": "/_unused_dummy_error_path_route_entities-school/:error",
        "handler": "entities-school.error"
      }
    ],
    {
      "as": "entities-school.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/school/:schoolId",
        "handler": "entities-school"
      },
      {
        "path": "/",
        "handler": "entities-school.highlights"
      }
    ],
    {
      "as": "entities-school.highlights"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/school/:schoolId",
        "handler": "entities-school"
      },
      {
        "path": "/",
        "handler": "entities-school.highlights"
      }
    ],
    {
      "as": "entities-school"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/school/:schoolId",
        "handler": "entities-school"
      },
      {
        "path": "/details",
        "handler": "entities-school.details"
      }
    ],
    {
      "as": "entities-school.details"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/school/:schoolId",
        "handler": "entities-school"
      },
      {
        "path": "/people",
        "handler": "entities-school.people"
      }
    ],
    {
      "as": "entities-school.people"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/school/:schoolId/all-students-and-alumni-you-know",
        "handler": "entities-school-all-students-and-alumni-you-know"
      }
    ],
    {
      "as": "entities-school-all-students-and-alumni-you-know"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/school/:schoolId/all-notable-alumni",
        "handler": "entities-school-all-notable-alumni"
      }
    ],
    {
      "as": "entities-school-all-notable-alumni"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/school/:schoolId/all-alumni",
        "handler": "entities-school-all-alumni"
      }
    ],
    {
      "as": "entities-school-all-alumni"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/group/:groupId",
        "handler": "entities-group"
      },
      {
        "path": "/loading",
        "handler": "entities-group.loading"
      }
    ],
    {
      "as": "entities-group.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/group/:groupId",
        "handler": "entities-group"
      },
      {
        "path": "/_unused_dummy_error_path_route_entities-group/:error",
        "handler": "entities-group.error"
      }
    ],
    {
      "as": "entities-group.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/group/:groupId",
        "handler": "entities-group"
      },
      {
        "path": "/",
        "handler": "entities-group.posts"
      }
    ],
    {
      "as": "entities-group.posts"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/group/:groupId",
        "handler": "entities-group"
      },
      {
        "path": "/",
        "handler": "entities-group.posts"
      }
    ],
    {
      "as": "entities-group"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/group/:groupId",
        "handler": "entities-group"
      },
      {
        "path": "/details",
        "handler": "entities-group.details"
      }
    ],
    {
      "as": "entities-group.details"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/groups/:groupId",
        "handler": "entities-groups"
      }
    ],
    {
      "as": "entities-groups"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/group/:groupId/all-members",
        "handler": "entities-group-all-members"
      }
    ],
    {
      "as": "entities-group-all-members"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/loading",
        "handler": "settings.loading"
      }
    ],
    {
      "as": "settings.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/_unused_dummy_error_path_route_settings/:error",
        "handler": "settings.error"
      }
    ],
    {
      "as": "settings.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/",
        "handler": "settings.account"
      }
    ],
    {
      "as": "settings.account"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/",
        "handler": "settings.account"
      }
    ],
    {
      "as": "settings"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/activity-broadcast",
        "handler": "settings.activity-broadcast"
      }
    ],
    {
      "as": "settings.activity-broadcast"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/allow-follow",
        "handler": "settings.allow-follow"
      }
    ],
    {
      "as": "settings.allow-follow"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/change-password",
        "handler": "settings.change-password"
      }
    ],
    {
      "as": "settings.change-password"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/communications",
        "handler": "settings.communications"
      }
    ],
    {
      "as": "settings.communications"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/email",
        "handler": "settings.email"
      }
    ],
    {
      "as": "settings.email"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/email-frequency",
        "handler": "settings.email-frequency"
      }
    ],
    {
      "as": "settings.email-frequency"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/email-visibility",
        "handler": "settings.email-visibility"
      }
    ],
    {
      "as": "settings.email-visibility"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/enhanced-advertising",
        "handler": "settings.enhanced-advertising"
      }
    ],
    {
      "as": "settings.enhanced-advertising"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/member-blocking",
        "handler": "settings.member-blocking"
      }
    ],
    {
      "as": "settings.member-blocking"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/phone",
        "handler": "settings.phone"
      }
    ],
    {
      "as": "settings.phone"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/phone-visibility",
        "handler": "settings.phone-visibility"
      }
    ],
    {
      "as": "settings.phone-visibility"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/privacy",
        "handler": "settings.privacy"
      }
    ],
    {
      "as": "settings.privacy"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/profile-suggestions",
        "handler": "settings.profile-suggestions"
      }
    ],
    {
      "as": "settings.profile-suggestions"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/profile-visibility",
        "handler": "settings.profile-visibility"
      }
    ],
    {
      "as": "settings.profile-visibility"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/sessions",
        "handler": "settings.sessions"
      }
    ],
    {
      "as": "settings.sessions"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/m/settings",
        "handler": "settings"
      },
      {
        "path": "/sms-frequency",
        "handler": "settings.sms-frequency"
      }
    ],
    {
      "as": "settings.sms-frequency"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/loading",
        "handler": "premium.loading"
      }
    ],
    {
      "as": "premium.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/_unused_dummy_error_path_route_premium/:error",
        "handler": "premium.error"
      }
    ],
    {
      "as": "premium.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/products",
        "handler": "premium.products"
      },
      {
        "path": "/loading",
        "handler": "premium.products.loading"
      }
    ],
    {
      "as": "premium.products.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/products",
        "handler": "premium.products"
      },
      {
        "path": "/_unused_dummy_error_path_route_products/:error",
        "handler": "premium.products.error"
      }
    ],
    {
      "as": "premium.products.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/products",
        "handler": "premium.products"
      },
      {
        "path": "/redeem",
        "handler": "premium.products.redeem"
      }
    ],
    {
      "as": "premium.products.redeem"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/products",
        "handler": "premium.products"
      },
      {
        "path": "/",
        "handler": "premium.products.index"
      }
    ],
    {
      "as": "premium.products.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/products",
        "handler": "premium.products"
      },
      {
        "path": "/",
        "handler": "premium.products.index"
      }
    ],
    {
      "as": "premium.products"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/onboarding",
        "handler": "premium.onboarding"
      }
    ],
    {
      "as": "premium.onboarding"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/",
        "handler": "premium.index"
      }
    ],
    {
      "as": "premium.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/premium",
        "handler": "premium"
      },
      {
        "path": "/",
        "handler": "premium.index"
      }
    ],
    {
      "as": "premium"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "m/payments",
        "handler": "payments"
      },
      {
        "path": "/loading",
        "handler": "payments.loading"
      }
    ],
    {
      "as": "payments.loading"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "m/payments",
        "handler": "payments"
      },
      {
        "path": "/_unused_dummy_error_path_route_payments/:error",
        "handler": "payments.error"
      }
    ],
    {
      "as": "payments.error"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "m/payments",
        "handler": "payments"
      },
      {
        "path": "purchase/:cartId",
        "handler": "payments.purchase"
      }
    ],
    {
      "as": "payments.purchase"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "m/payments",
        "handler": "payments"
      },
      {
        "path": "/",
        "handler": "payments.index"
      }
    ],
    {
      "as": "payments.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "m/payments",
        "handler": "payments"
      },
      {
        "path": "/",
        "handler": "payments.index"
      }
    ],
    {
      "as": "payments"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/",
        "handler": "authentication.index"
      }
    ],
    {
      "as": "authentication.index"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/",
        "handler": "authentication.index"
      }
    ],
    {
      "as": "authentication"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/",
        "handler": "authentication.index"
      }
    ],
    {
      "as": "configuration"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/",
        "handler": "authentication"
      },
      {
        "path": "/",
        "handler": "authentication.index"
      }
    ],
    {
      "as": "application"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/logout",
        "handler": "logout"
      }
    ],
    {
      "as": "logout"
    }
  ],
  [
    [
      {
        "path": "/",
        "handler": "application"
      },
      {
        "path": "/",
        "handler": "configuration"
      },
      {
        "path": "/login",
        "handler": "login"
      }
    ],
    {
      "as": "login"
    }
  ]
]
}.call(this));
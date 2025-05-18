import { useState } from "react";
import EmailDisplay from "./EmailDisplay";

const emailDetails = {
  id: "196dfbcd01aab0b7",
  threadId: "196dfbcd01aab0b7",
  labelIds: ["UNREAD", "CATEGORY_UPDATES", "INBOX"],
  snippet:
    "gmailapitesting was granted access to your Google account winzoneg3@gmail.com If you did not grant access, you should check this activity and secure your account. Check activity You can also see",
  payload: {
    partId: "",
    mimeType: "multipart/alternative",
    filename: "",
    headers: [
      {
        name: "Delivered-To",
        value: "winzoneg3@gmail.com",
      },
      {
        name: "Received",
        value:
          "by 2002:a05:7000:8f86:b0:662:7abe:f99f with SMTP id mr6csp522069mab;        Sat, 17 May 2025 12:33:36 -0700 (PDT)",
      },
      {
        name: "X-Received",
        value:
          "by 2002:a05:6602:4802:b0:867:9af:812e with SMTP id ca18e2360f4ac-86a23199d6emr956377439f.5.1747510415796;        Sat, 17 May 2025 12:33:35 -0700 (PDT)",
      },
      {
        name: "ARC-Seal",
        value:
          "i=1; a=rsa-sha256; t=1747510415; cv=none;        d=google.com; s=arc-20240605;        b=bx2N4z8Grp1gEOH7eSo61yMFwBDwBY9kKBcwX5/1aJP3mKgZZlUSEcHXHFAZ00uzFn         GNWEgMuylA9Gv9/nj4qonqQWuN/BRdmvjHLJBCoHYQRZls9N/j/Q+Kcve6irgDVddO0n         TOvO53EBzdEfgHGoYp/xv+/mlg6atv9CpTOsRko+n4DRvMXWjmybqpES/FfPCkotF14q         TnPi4WVM/trT4l35/zbr06VjONmd+2G6OI6N52PqibCj0RvgnWM6Nmf0sI9z+N0aayJj         zcUU7ZGycoKhhS9bwPzva7aSopLBVGBNd/FCYk/57XFtYXa49avJqdQgulwZpNWnzAQ+         AwDQ==",
      },
      {
        name: "ARC-Message-Signature",
        value:
          "i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605;        h=to:from:subject:message-id:feedback-id:date:mime-version         :dkim-signature;        bh=7ZECCkeHIYN84Sy/89JJcNrINIeCNh2hVp08Bkj7aJI=;        fh=zu+oG7sub4M7AuHZUOPHyfcXTr5/FYigBtiql8Bu6L0=;        b=MqncceXbzV+PelPQ3DoEUYw+KHIBWnVlWROE5mRNYUYJAhzLCldbiTua04Jc06lMMS         1gf6mLtT1Ar9DzBrZjVvrvVE4sRwh90UeI/l14KcazfeOfGaBjlQij7BVKJSREFALnMB         vTwdk/um7kUeOC/CdyT6KL4IIpoTXQj9Ny5bQAFTgdZAb76LIIzYn9LGlT03FBLl5f5B         ykeNrYbZE2iLa9qqwIBJsMksqaeOVLFwf0M1irukYA/zumwU8ip1bSNzYfxyDjbN4lyb         xTzZG1AnXawhBVu6d2FYXmDbhkFxs0rXjmdTqxFw05IPUCclbRplPzw3S0Cn90vUI7kH         czKg==;        dara=google.com",
      },
      {
        name: "ARC-Authentication-Results",
        value:
          "i=1; mx.google.com;       dkim=pass header.i=@accounts.google.com header.s=20230601 header.b=dx0z5yry;       spf=pass (google.com: domain of 3j-qoaagtcuqtu-xkvr4giiu0tzy.muumrk.ius2ot5utkm9msgor.ius@gaia.bounces.google.com designates 209.85.220.73 as permitted sender) smtp.mailfrom=3j-QoaAgTCUQtu-xkvr4giiu0tzy.muumrk.ius2ot5utkm9msgor.ius@gaia.bounces.google.com;       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=accounts.google.com;       dara=pass header.i=@gmail.com",
      },
      {
        name: "Return-Path",
        value:
          "<3j-QoaAgTCUQtu-xkvr4giiu0tzy.muumrk.ius2ot5utkm9msgor.ius@gaia.bounces.google.com>",
      },
      {
        name: "Received",
        value:
          "from mail-sor-f73.google.com (mail-sor-f73.google.com. [209.85.220.73])        by mx.google.com with SMTPS id ca18e2360f4ac-86a234ec5bdsor284450039f.0.2025.05.17.12.33.35        for <winzoneg3@gmail.com>        (Google Transport Security);        Sat, 17 May 2025 12:33:35 -0700 (PDT)",
      },
      {
        name: "Received-SPF",
        value:
          "pass (google.com: domain of 3j-qoaagtcuqtu-xkvr4giiu0tzy.muumrk.ius2ot5utkm9msgor.ius@gaia.bounces.google.com designates 209.85.220.73 as permitted sender) client-ip=209.85.220.73;",
      },
      {
        name: "Authentication-Results",
        value:
          "mx.google.com;       dkim=pass header.i=@accounts.google.com header.s=20230601 header.b=dx0z5yry;       spf=pass (google.com: domain of 3j-qoaagtcuqtu-xkvr4giiu0tzy.muumrk.ius2ot5utkm9msgor.ius@gaia.bounces.google.com designates 209.85.220.73 as permitted sender) smtp.mailfrom=3j-QoaAgTCUQtu-xkvr4giiu0tzy.muumrk.ius2ot5utkm9msgor.ius@gaia.bounces.google.com;       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=accounts.google.com;       dara=pass header.i=@gmail.com",
      },
      {
        name: "DKIM-Signature",
        value:
          "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=accounts.google.com; s=20230601; t=1747510415; x=1748115215; dara=google.com;        h=to:from:subject:message-id:feedback-id:date:mime-version:from:to:cc         :subject:date:message-id:reply-to;        bh=7ZECCkeHIYN84Sy/89JJcNrINIeCNh2hVp08Bkj7aJI=;        b=dx0z5yryTcoSGxRUoqX2Del5tKsv+S3BzZIvhLJcqhK2SenMRrHJdV5yQJWtC9v8nj         jUeh2dWyataA296UNIDgPw8TP7YH/xmRE3OekKOhSTnrMk0AM3xuZH0esxGCOgsPhlXp         x3YJN4tDf3zzH3j/hFRXO8UXr0bLqeFyeGICk0ytuf4k1wntcHa8TuvmyI3O1ROkSvoz         A6+NlxnZjm97HaIO5DWC/+0DRegdwuQS3PEkx+kDiFN5BWLfQxt/UYRZQHRlzTPl4ug6         +eHQ90OPYLuMDr8gnOFC22K5hnzi8V4tEC1LUjNk4ZsI/R29/xL23bcJJSaTGv0uILc7         jGZQ==",
      },
      {
        name: "X-Google-DKIM-Signature",
        value:
          "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20230601; t=1747510415; x=1748115215;        h=to:from:subject:message-id:feedback-id:date:mime-version         :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to;        bh=7ZECCkeHIYN84Sy/89JJcNrINIeCNh2hVp08Bkj7aJI=;        b=MuKWuwB1oZF/C2++RVULPwrM1ZkDzZpWj/LmJ9BOwhu2qJPNFbaB6mgpxwihW0zGgY         x+PD/KE6vxIWuLCmbYgYEKFmEWoBijyw3kXuDnMJ7yeUvDwpLfCIi0dQsdLB6+VN1t4/         Gl7McmxJvUKI5BBRR5ZDDOCd4kMVVr3kUdSAHyJMjfCXJI1Cv7i61pwPeS+gPGj0L+75         jAiXurMsjENXq6aDkVIrfBvXANfenXJhLn2QPf0DHO2pNJ0xhUzmOdZvWZpQGbIyJ8Hu         ipED0QKYXk0byM3m1olzuHv3bzX4SvNW4YsqXzgroISPN9Q8PRQ/o3BiFF1cFY0zCqEf         HyFA==",
      },
      {
        name: "X-Gm-Message-State",
        value:
          "AOJu0YzyvuKPogOPHYmUnSCngT6XjWywl9P87t/mUvAXlzuoy8Ml7i0G 4HSQG38gZ/0GfFEADRaWPT6xIVdHynFMSOiRU1/8LAhgf+9040yzdhLooQLTqxMUbWZBBPUqrqY zOpoVl+rPf7dPs4Dha0fvMNoViGoBGtRdF2QGOsY=",
      },
      {
        name: "X-Google-Smtp-Source",
        value:
          "AGHT+IGlPJWCGuazxHxugn2QS6QvRN1yPrQ0j2UnXKxWvVkdSa4yEC9oCj2Ode8P6lu8H/YFXKKueac3VeueTn96B1FCOg==",
      },
      {
        name: "MIME-Version",
        value: "1.0",
      },
      {
        name: "X-Received",
        value:
          "by 2002:a05:6602:19c4:b0:86a:25d5:2dbe with SMTP id ca18e2360f4ac-86a25d52e54mr673522339f.4.1747510415435; Sat, 17 May 2025 12:33:35 -0700 (PDT)",
      },
      {
        name: "Date",
        value: "Sat, 17 May 2025 19:33:34 GMT",
      },
      {
        name: "X-Account-Notification-Type",
        value: "127",
      },
      {
        name: "Feedback-ID",
        value: "127:account-notifier",
      },
      {
        name: "X-Notifications",
        value: "9b01b2756aca0000",
      },
      {
        name: "X-Notifications-Bounce-Info",
        value:
          "AXXYx-KaOrZx0a6PMbYegWm3CNPxVCO5din94WrjAQcRkJEaT5Uyf89Rx6uGK6V_-ryePVSZsVPdodrChUjRi4XTWQV8zJPAZu_wFXT_l2ZhxEEHR1snWJERXGf-ADNdmLFtGeh9_dm_kmiKiAS9En3XOYMBd8RFObMpf8AIjm7ltb2brsrTnMiKuGam0NZeZbwt1w-m3XPWQ9CuNjAwNjA0MDQxNTM1NTk2OTMzMg",
      },
      {
        name: "Message-ID",
        value: "<9dpz65bKrQ3XRE_yhboMhw@notifications.google.com>",
      },
      {
        name: "Subject",
        value: "Security alert",
      },
      {
        name: "From",
        value: "Google <no-reply@accounts.google.com>",
      },
      {
        name: "To",
        value: "winzoneg3@gmail.com",
      },
      {
        name: "Content-Type",
        value: 'multipart/alternative; boundary="0000000000008da799063559f96e"',
      },
    ],
    body: {
      size: 0,
    },
    parts: [
      {
        partId: "0",
        mimeType: "text/plain",
        filename: "",
        headers: [
          {
            name: "Content-Type",
            value: 'text/plain; charset="UTF-8"; format=flowed; delsp=yes',
          },
          {
            name: "Content-Transfer-Encoding",
            value: "base64",
          },
        ],
        body: {
          size: 661,
          data: "W2ltYWdlOiBHb29nbGVdDQpnbWFpbGFwaXRlc3Rpbmcgd2FzIGdyYW50ZWQgYWNjZXNzIHRvIHlvdXIgR29vZ2xlIGFjY291bnQNCg0KDQp3aW56b25lZzNAZ21haWwuY29tDQoNCklmIHlvdSBkaWQgbm90IGdyYW50IGFjY2VzcywgeW91IHNob3VsZCBjaGVjayB0aGlzIGFjdGl2aXR5IGFuZCBzZWN1cmUgeW91cg0KYWNjb3VudC4NCkNoZWNrIGFjdGl2aXR5DQo8aHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL0FjY291bnRDaG9vc2VyP0VtYWlsPXdpbnpvbmVnM0BnbWFpbC5jb20mY29udGludWU9aHR0cHM6Ly9teWFjY291bnQuZ29vZ2xlLmNvbS9hbGVydC9udC8xNzQ3NTEwNDE0MDAwP3JmbiUzRDEyNyUyNnJmbmMlM0QxJTI2ZWlkJTNELTI1MzI1NjY3NzMxMDYwNTU0NDUlMjZldCUzRDA-DQpZb3UgY2FuIGFsc28gc2VlIHNlY3VyaXR5IGFjdGl2aXR5IGF0DQpodHRwczovL215YWNjb3VudC5nb29nbGUuY29tL25vdGlmaWNhdGlvbnMNCllvdSByZWNlaXZlZCB0aGlzIGVtYWlsIHRvIGxldCB5b3Uga25vdyBhYm91dCBpbXBvcnRhbnQgY2hhbmdlcyB0byB5b3VyDQpHb29nbGUgQWNjb3VudCBhbmQgc2VydmljZXMuDQrCqSAyMDI1IEdvb2dsZSBMTEMsIDE2MDAgQW1waGl0aGVhdHJlIFBhcmt3YXksIE1vdW50YWluIFZpZXcsIENBIDk0MDQzLCBVU0ENCg==",
        },
      },
      {
        partId: "1",
        mimeType: "text/html",
        filename: "",
        headers: [
          {
            name: "Content-Type",
            value: 'text/html; charset="UTF-8"',
          },
          {
            name: "Content-Transfer-Encoding",
            value: "quoted-printable",
          },
        ],
        body: {
          size: 4703,
          data: "PCFET0NUWVBFIGh0bWw-PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIG5hbWU9ImZvcm1hdC1kZXRlY3Rpb24iIGNvbnRlbnQ9ImVtYWlsPW5vIi8-PG1ldGEgbmFtZT0iZm9ybWF0LWRldGVjdGlvbiIgY29udGVudD0iZGF0ZT1ubyIvPjxzdHlsZSBub25jZT0iZ092ZmljMGkwOUtyWDgxSzFhX1JxdyI-LmF3bCBhIHtjb2xvcjogI0ZGRkZGRjsgdGV4dC1kZWNvcmF0aW9uOiBub25lO30gLmFibWwgYSB7Y29sb3I6ICMwMDAwMDA7IGZvbnQtZmFtaWx5OiBSb2JvdG8tTWVkaXVtLEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmOyBmb250LXdlaWdodDogYm9sZDsgdGV4dC1kZWNvcmF0aW9uOiBub25lO30gLmFkZ2wgYSB7Y29sb3I6IHJnYmEoMCwgMCwgMCwgMC44Nyk7IHRleHQtZGVjb3JhdGlvbjogbm9uZTt9IC5hZmFsIGEge2NvbG9yOiAjYjBiMGIwOyB0ZXh0LWRlY29yYXRpb246IG5vbmU7fSBAbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiA2MDBweCkgey52MnNwIHtwYWRkaW5nOiA2cHggMzBweCAwcHg7fSAudjJyc3Age3BhZGRpbmc6IDBweCAxMHB4O319IEBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDYwMHB4KSB7Lm1kdjJydyB7cGFkZGluZzogNDBweCA0MHB4O319IDwvc3R5bGU-PGxpbmsgaHJlZj0iLy9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M_ZmFtaWx5PUdvb2dsZStTYW5zIiByZWw9InN0eWxlc2hlZXQiIHR5cGU9InRleHQvY3NzIiBub25jZT0iZ092ZmljMGkwOUtyWDgxSzFhX1JxdyIvPjwvaGVhZD48Ym9keSBzdHlsZT0ibWFyZ2luOiAwOyBwYWRkaW5nOiAwOyIgYmdjb2xvcj0iI0ZGRkZGRiI-PHRhYmxlIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0eWxlPSJtaW4td2lkdGg6IDM0OHB4OyIgYm9yZGVyPSIwIiBjZWxsc3BhY2luZz0iMCIgY2VsbHBhZGRpbmc9IjAiIGxhbmc9ImVuIj48dHIgaGVpZ2h0PSIzMiIgc3R5bGU9ImhlaWdodDogMzJweDsiPjx0ZD48L3RkPjwvdHI-PHRyIGFsaWduPSJjZW50ZXIiPjx0ZD48ZGl2IGl0ZW1zY29wZSBpdGVtdHlwZT0iLy9zY2hlbWEub3JnL0VtYWlsTWVzc2FnZSI-PGRpdiBpdGVtcHJvcD0iYWN0aW9uIiBpdGVtc2NvcGUgaXRlbXR5cGU9Ii8vc2NoZW1hLm9yZy9WaWV3QWN0aW9uIj48bGluayBpdGVtcHJvcD0idXJsIiBocmVmPSJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vQWNjb3VudENob29zZXI_RW1haWw9d2luem9uZWczQGdtYWlsLmNvbSZhbXA7Y29udGludWU9aHR0cHM6Ly9teWFjY291bnQuZ29vZ2xlLmNvbS9hbGVydC9udC8xNzQ3NTEwNDE0MDAwP3JmbiUzRDEyNyUyNnJmbmMlM0QxJTI2ZWlkJTNELTI1MzI1NjY3NzMxMDYwNTU0NDUlMjZldCUzRDAiLz48bWV0YSBpdGVtcHJvcD0ibmFtZSIgY29udGVudD0iUmV2aWV3IEFjdGl2aXR5Ii8-PC9kaXY-PC9kaXY-PHRhYmxlIGJvcmRlcj0iMCIgY2VsbHNwYWNpbmc9IjAiIGNlbGxwYWRkaW5nPSIwIiBzdHlsZT0icGFkZGluZy1ib3R0b206IDIwcHg7IG1heC13aWR0aDogNTE2cHg7IG1pbi13aWR0aDogMjIwcHg7Ij48dHI-PHRkIHdpZHRoPSI4IiBzdHlsZT0id2lkdGg6IDhweDsiPjwvdGQ-PHRkPjxkaXYgc3R5bGU9ImJvcmRlci1zdHlsZTogc29saWQ7IGJvcmRlci13aWR0aDogdGhpbjsgYm9yZGVyLWNvbG9yOiNkYWRjZTA7IGJvcmRlci1yYWRpdXM6IDhweDsgcGFkZGluZzogNDBweCAyMHB4OyIgYWxpZ249ImNlbnRlciIgY2xhc3M9Im1kdjJydyI-PGltZyBzcmM9Imh0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ltYWdlcy9icmFuZGluZy9nb29nbGVsb2dvLzJ4L2dvb2dsZWxvZ29fY29sb3JfNzR4MjRkcC5wbmciIHdpZHRoPSI3NCIgaGVpZ2h0PSIyNCIgYXJpYS1oaWRkZW49InRydWUiIHN0eWxlPSJtYXJnaW4tYm90dG9tOiAxNnB4OyIgYWx0PSJHb29nbGUiPjxkaXYgc3R5bGU9ImZvbnQtZmFtaWx5OiAmIzM5O0dvb2dsZSBTYW5zJiMzOTssUm9ib3RvLFJvYm90b0RyYWZ0LEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2JvcmRlci1ib3R0b206IHRoaW4gc29saWQgI2RhZGNlMDsgY29sb3I6IHJnYmEoMCwwLDAsMC44Nyk7IGxpbmUtaGVpZ2h0OiAzMnB4OyBwYWRkaW5nLWJvdHRvbTogMjRweDt0ZXh0LWFsaWduOiBjZW50ZXI7IHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7Ij48ZGl2IHN0eWxlPSJmb250LXNpemU6IDI0cHg7Ij48YT5nbWFpbGFwaXRlc3Rpbmc8L2E-IHdhcyBncmFudGVkIGFjY2VzcyB0byB5b3VyIEdvb2dsZSZuYnNwO2FjY291bnQgPC9kaXY-PHRhYmxlIGFsaWduPSJjZW50ZXIiIHN0eWxlPSJtYXJnaW4tdG9wOjhweDsiPjx0ciBzdHlsZT0ibGluZS1oZWlnaHQ6IG5vcm1hbDsiPjx0ZCBhbGlnbj0icmlnaHQiIHN0eWxlPSJwYWRkaW5nLXJpZ2h0OjhweDsiPjxpbWcgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBzdHlsZT0id2lkdGg6IDIwcHg7IGhlaWdodDogMjBweDsgdmVydGljYWwtYWxpZ246IHN1YjsgYm9yZGVyLXJhZGl1czogNTAlOzsiIHNyYz0iaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSmJpeHp2UVhiV2pYc1dRN3dOMzNjSnVDRndSVkxiRHBKckItVWJSa0FOa0pHUndBPXM5Ni1jIiBhbHQ9IiI-PC90ZD48dGQ-PGEgc3R5bGU9ImZvbnQtZmFtaWx5OiAmIzM5O0dvb2dsZSBTYW5zJiMzOTssUm9ib3RvLFJvYm90b0RyYWZ0LEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2NvbG9yOiByZ2JhKDAsMCwwLDAuODcpOyBmb250LXNpemU6IDE0cHg7IGxpbmUtaGVpZ2h0OiAyMHB4OyI-d2luem9uZWczQGdtYWlsLmNvbTwvYT48L3RkPjwvdHI-PC90YWJsZT4gPC9kaXY-PGRpdiBzdHlsZT0iZm9udC1mYW1pbHk6IFJvYm90by1SZWd1bGFyLEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmOyBmb250LXNpemU6IDE0cHg7IGNvbG9yOiByZ2JhKDAsMCwwLDAuODcpOyBsaW5lLWhlaWdodDogMjBweDtwYWRkaW5nLXRvcDogMjBweDsgdGV4dC1hbGlnbjogbGVmdDsiPjxicj5JZiB5b3UgZGlkIG5vdCBncmFudCBhY2Nlc3MsIHlvdSBzaG91bGQgY2hlY2sgdGhpcyBhY3Rpdml0eSBhbmQgc2VjdXJlIHlvdXIgYWNjb3VudC48ZGl2IHN0eWxlPSJwYWRkaW5nLXRvcDogMzJweDsgdGV4dC1hbGlnbjogY2VudGVyOyI-PGEgaHJlZj0iaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL0FjY291bnRDaG9vc2VyP0VtYWlsPXdpbnpvbmVnM0BnbWFpbC5jb20mYW1wO2NvbnRpbnVlPWh0dHBzOi8vbXlhY2NvdW50Lmdvb2dsZS5jb20vYWxlcnQvbnQvMTc0NzUxMDQxNDAwMD9yZm4lM0QxMjclMjZyZm5jJTNEMSUyNmVpZCUzRC0yNTMyNTY2NzczMTA2MDU1NDQ1JTI2ZXQlM0QwIiB0YXJnZXQ9Il9ibGFuayIgbGluay1pZD0ibWFpbi1idXR0b24tbGluayIgc3R5bGU9ImZvbnQtZmFtaWx5OiAmIzM5O0dvb2dsZSBTYW5zJiMzOTssUm9ib3RvLFJvYm90b0RyYWZ0LEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmOyBsaW5lLWhlaWdodDogMTZweDsgY29sb3I6ICNmZmZmZmY7IGZvbnQtd2VpZ2h0OiA0MDA7IHRleHQtZGVjb3JhdGlvbjogbm9uZTtmb250LXNpemU6IDE0cHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7cGFkZGluZzogMTBweCAyNHB4O2JhY2tncm91bmQtY29sb3I6ICM0MTg0RjM7IGJvcmRlci1yYWRpdXM6IDVweDsgbWluLXdpZHRoOiA5MHB4OyI-Q2hlY2sgYWN0aXZpdHk8L2E-PC9kaXY-PC9kaXY-PGRpdiBzdHlsZT0icGFkZGluZy10b3A6IDIwcHg7IGZvbnQtc2l6ZTogMTJweDsgbGluZS1oZWlnaHQ6IDE2cHg7IGNvbG9yOiAjNWY2MzY4OyBsZXR0ZXItc3BhY2luZzogMC4zcHg7IHRleHQtYWxpZ246IGNlbnRlciI-WW91IGNhbiBhbHNvIHNlZSBzZWN1cml0eSBhY3Rpdml0eSBhdDxicj48YSBzdHlsZT0iY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44Nyk7dGV4dC1kZWNvcmF0aW9uOiBpbmhlcml0OyI-aHR0cHM6Ly9teWFjY291bnQuZ29vZ2xlLmNvbS9ub3RpZmljYXRpb25zPC9hPjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9InRleHQtYWxpZ246IGxlZnQ7Ij48ZGl2IHN0eWxlPSJmb250LWZhbWlseTogUm9ib3RvLVJlZ3VsYXIsSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Y29sb3I6IHJnYmEoMCwwLDAsMC41NCk7IGZvbnQtc2l6ZTogMTFweDsgbGluZS1oZWlnaHQ6IDE4cHg7IHBhZGRpbmctdG9wOiAxMnB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7Ij48ZGl2PllvdSByZWNlaXZlZCB0aGlzIGVtYWlsIHRvIGxldCB5b3Uga25vdyBhYm91dCBpbXBvcnRhbnQgY2hhbmdlcyB0byB5b3VyIEdvb2dsZSBBY2NvdW50IGFuZCBzZXJ2aWNlcy48L2Rpdj48ZGl2IHN0eWxlPSJkaXJlY3Rpb246IGx0cjsiPiZjb3B5OyAyMDI1IEdvb2dsZSBMTEMsIDxhIGNsYXNzPSJhZmFsIiBzdHlsZT0iZm9udC1mYW1pbHk6IFJvYm90by1SZWd1bGFyLEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2NvbG9yOiByZ2JhKDAsMCwwLDAuNTQpOyBmb250LXNpemU6IDExcHg7IGxpbmUtaGVpZ2h0OiAxOHB4OyBwYWRkaW5nLXRvcDogMTJweDsgdGV4dC1hbGlnbjogY2VudGVyOyI-MTYwMCBBbXBoaXRoZWF0cmUgUGFya3dheSwgTW91bnRhaW4gVmlldywgQ0EgOTQwNDMsIFVTQTwvYT48L2Rpdj48L2Rpdj48L2Rpdj48L3RkPjx0ZCB3aWR0aD0iOCIgc3R5bGU9IndpZHRoOiA4cHg7Ij48L3RkPjwvdHI-PC90YWJsZT48L3RkPjwvdHI-PHRyIGhlaWdodD0iMzIiIHN0eWxlPSJoZWlnaHQ6IDMycHg7Ij48dGQ-PC90ZD48L3RyPjwvdGFibGU-PC9ib2R5PjwvaHRtbD4=",
        },
      },
    ],
  },
  sizeEstimate: 12080,
  historyId: "688875",
  internalDate: "1747510414000",
};
const myPredefinedLabels = [
  "Urgent",
  "Support Request",
  "Invoice",
  "Meeting",
  "Project Update",
  "Spam",
  "CATEGORY_PROMOTIONS",
];
function Test() {
  const [emailData, setEmailData] = useState({});
  // async function aiGeneration(){
  //     analyzeEmailWithLLM(emailData, myPredefinedLabels)
  //     .then(analysis => {
  //       console.log('LLM Analysis:', analysis);
  //       // Now you can use analysis.classification, analysis.summary, etc. in your UI
  //     })
  //     .catch(err => {
  //       console.error('Failed to get LLM analysis:', err);
  //     });
  // }
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <div className="h-full w-1/2">
        <EmailDisplay email={emailDetails} setEmailData={setEmailData} />
      </div>
    </div>
  );
}

export default Test;

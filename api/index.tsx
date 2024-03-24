import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/vercel";
import { configDotenv } from "dotenv";
import { ChainEnum } from "@dynamic-labs/sdk-api/models/ChainEnum";
import { UserResponse } from "@dynamic-labs/sdk-api/models/UserResponse";


configDotenv();

const key = process.env.VITE_KEY;
const environmentId = process.env.VITE_ENVIRONMENT_ID;
let newWallets: string[];

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
});

app.use(async (c, next) => {
  await next();
  const isFrame = c.res.headers.get('content-type')?.includes('html');
  if (isFrame) {
    let html = await c.res.text();
    const metaTag = '<meta property="of:accepts:xmtp" content="2024-02-01" />';
    html = html.replace(/(<head>)/i, `$1${metaTag}`);
    console.log("metaTag: ",metaTag,"html: ", html);
    c.res = new Response(html, {
      headers: {
        'content-type': 'text/html',
      },
    });
  }
});


const createEmbeddedWallet = async (
  email: string,
  fid: number,
  chains: ChainEnum[]
) => {
  console.log("Creating embedded wallets for", email, fid, chains);
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      fid,
      chains,
    }),
  };

  const response = await fetch(
    `https://app.dynamic.xyz/api/v0/environments/${environmentId}/embeddedWallets/farcaster`,
    options
  ).then((r) => r.json());

  console.debug(response, response?.user?.wallets);
  newWallets = (response as UserResponse).user.wallets.map(
    (wallet: any) => wallet.publicKey
  );

  return newWallets;
};

app.frame("/", async (c) => { ///// Top level image (dynamicxyz)
  const { frameData, inputText, status, buttonValue } = c;
  const isValidEmail = inputText
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputText)
    : false;

  const fid = frameData?.fid;
  let error = status != "initial" && (!isValidEmail || !fid);

  if (
    !error &&
    status != "initial" &&
    isValidEmail &&
    inputText &&
    fid &&
    buttonValue === "submit"
  ) {
    try {
      newWallets = await createEmbeddedWallet(inputText, fid, [
        ChainEnum.Evm
      ]);
    } catch (e) {
      error = true;
    }
  }

  return c.res({

    action: '/selection',

    image: (
      <div
        style={{
          alignItems: "center",
          background:
            "url('https://utfs.io/f/56f3dcce-8eee-4cc4-8ece-240a03298b6b-r0q65m.jpeg')",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background:
              "url('https://utfs.io/f/56f3dcce-8eee-4cc4-8ece-240a03298b6b-r0q65m.jpeg')",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
            fontSize: 30,
            fontStyle: "normal",
          }}
        >
          {status === "initial" && !error ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto' }}>
                  <div style={{ color: "black", fontWeight: "bold", fontSize: '2rem', textAlign: 'center' }}>
                      Create a Dynamic EVM+Solana embedded wallet
                  </div>
                  <div style={{ color: "black", textAlign: 'center', marginTop: '2rem', maxWidth: '75%' }}>
                      Enter your email to generate a wallet. The wallet will also be associated with your Farcaster ID.
                  </div>
              </div>
          ) : newWallets && newWallets.length > 0 ? (
            newWallets.map((wallet, index) => (
              <div key={index} style={{ color: "black" }}>
                {index == 0 ? `EVM: ${wallet}` : `SOL: ${wallet}`}
              </div>
            ))
          ) : (
            <div style={{ color: "black" }}>
              No wallets created yet or an error occurred.
            </div>
          )}
        </div>
      </div>
    ),

    ///////
    intents: status === "initial" ?  [
      <TextInput placeholder="Enter a valid email" />,
      <Button value="submit">Create SOL + EVM Embedded Wallets</Button>,
    ] : [
        <Button.Link href="https://demo.dynamic.xyz">
            Log in to access your wallets
        </Button.Link>
    ],
    ///////

  });
});

app.frame('/selection', async (c) => { ///// 2nd level (dont meme what it memes)


    console.log('c', c)
    return c.res({

      action: '/selection2',

      image: (
        <div
            style={{
              alignItems: "center",
              background:
                "url('https://media.sproutsocial.com/uploads/meme-example.jpg')",
              backgroundSize: "100% 100%",
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
              height: "100%",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
            }}
        >
        </div>
      ),

      intents: [
        <Button value="A">Next Meme Pls</Button>
      ]
  });
});

app.frame('/selection2', async (c) => { //// level 3 (silent movie meme)


  console.log('c', c)
  return c.res({

    action: '/selection3',

    image: (
      <div
          style={{
            alignItems: "center",
            background:
              "url('https://i.pinimg.com/originals/7f/14/75/7f147508568d2e7f0bd61f9f8b09ce43.jpg ')",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
      >
      </div>
    ),

    intents: [
      <Button value="A">Next Meme Pls</Button>,
    ]
});
});

app.frame('/selection3', async (c) => { //// level 4 (fish)


  console.log('c', c)
  return c.res({

    action: '/selection4',

    image: (
      <div
          style={{
            alignItems: "center",
            background:
              "url('https://www.boredpanda.com/blog/wp-content/uploads/2023/06/science-memes-jokes-cover_800.jpg')",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
      >
      </div>
    ),

    intents: [
      <Button value="A">Next Meme Pls</Button>,
    ]
});
});

app.frame('/selection4', async (c) => { //// level 5 (dragonese)


  console.log('c', c)
  return c.res({

    action: '/selection5',

    image: (
      <div
          style={{
            alignItems: "center",
            background:
              "url('https://fosi-assets.s3.amazonaws.com/media/original_images/funny-game-of-thrones-memes-coverimage.jpg')",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
      >
      </div>
    ),

    intents: [
      <Button value="A">Next Meme Pls</Button>,
    ]
});
});

app.frame('/selection5', async (c) => { //// level 6 (wonka)


  console.log('c', c)
  return c.res({

    action: '/selection6',

    image: (
      <div
          style={{
            alignItems: "center",
            background:
              "url('https://static.standard.co.uk/s3fs-public/thumbnails/image/2016/08/17/12/meme-exhibition.jpg')",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
      >
      </div>
    ),

    intents: [
      <Button value="A">Next Meme Pls</Button>,
    ]
});
});

app.frame('/selection6', async (c) => { //// level 7 (burrito)


  console.log('c', c)
  return c.res({

    action: '/selection7',

    image: (
      <div
          style={{
            alignItems: "center",
            background:
              "url('https://www.adobe.com/express/create/media_10d832fed2b86d900503c50ac4b30b14058e4134c.jpeg?width=400&format=jpeg&optimize=medium')",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
      >
      </div>
    ),

    intents: [
      <Button value="A">Next Meme Pls</Button>,
    ]
});
});

app.frame('/selection7', async (c) => { //// level 8 (deprecate)


  console.log('c', c)
  return c.res({

    action: '/selection8',

    image: (
      <div
          style={{
            alignItems: "center",
            background:
              "url('https://i.ytimg.com/vi/Xf2foypJMXM/sddefault.jpg')",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
      >
      </div>
    ),

    intents: [
      <Button value="A">Next Meme Pls</Button>,
    ]
});
});

app.frame('/selection8', async (c) => { //// level 9 (copyright)


  console.log('c', c)
  return c.res({

    action: '/selection9',

    image: (
      <div
          style={{
            alignItems: "center",
            background:
              "url('https://www.law.nyu.edu/sites/default/files/styles/full_width/public/Gallery_Gray_Cat_Copyright_Reform_001.jpg')",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
      >
      </div>
    ),

    intents: [
      <Button value="A">Next Meme Pls</Button>,
    ]
});
});

export const GET = handle(app);
export const POST = handle(app);

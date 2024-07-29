document.addEventListener('DOMContentLoaded', () => {
    const auth0 = new auth0.WebAuth({
        domain: dev-oevv5qq8opeha15h.us.auth0.com,
        clientID: Uon3JcliFgKAmtD0C0pK3yEOx67qzcf1,
        redirectUri: window.location.href,
        responseType: 'token id_token',
        scope: 'openid profile email'
    });

    document.getElementById('login').addEventListener('click', () => {
        auth0.authorize();
    });

    function handleAuthentication() {
        auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                localLogin(authResult);
            } else if (err) {
                console.log(err);
            }
        });
    }

    function localLogin(authResult) {
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(authResult.idTokenPayload));
        displayButtons();
    }

    function displayButtons() {
        const loginStatus = document.querySelector('.container h4');
        const loginView = document.getElementById('login-view');
        const homeView = document.getElementById('home-view');
        if (localStorage.getItem('id_token')) {
            loginView.style.display = 'none';
            homeView.style.display = 'block';
            loginStatus.innerHTML = 'You are logged in!';
        } else {
            loginView.style.display = 'block';
            homeView.style.display = 'none';
            loginStatus.innerHTML = 'You are not logged in!';
        }
    }

    handleAuthentication();
    displayButtons();
});
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

// Create a connector
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

// Check if connection is already established
if (!connector.connected) {
  // create new session
  connector.createSession();
}

// Subscribe to connection events
connector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get provided accounts and chainId
  const { accounts, chainId } = payload.params[0];
  console.log(accounts, chainId);
});

connector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts and chainId
  const { accounts, chainId } = payload.params[0];
  console.log(accounts, chainId);
});

connector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Delete connector
  console.log("Disconnected");
});
async function fetchTopTraders() {
    try {
        const response = await fetch('http://localhost:5000/api/traders');
        const traders = await response.json();
        const tradersList = document.getElementById('top-traders');
        tradersList.innerHTML = '';
        traders.forEach(trader => {
            const traderItem = document.createElement('li');
            traderItem.textContent = `${trader.name} - Performance: ${trader.performance}`;
            tradersList.appendChild(traderItem);
        });
    } catch (err) {
        console.error('Error fetching top traders:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTopTraders();
});
async function fetchTraderAnalytics(traderId) {
    try {
        const response = await fetch(`http://localhost:5000/api/traders/${traderId}/analytics`);
        const analyticsData = await response.json();
        displayAnalytics(analyticsData);
    } catch (err) {
        console.error('Error fetching trader analytics:', err);
    }
}

function displayAnalytics(data) {
    const ctx = document.getElementById('trading-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: 'Trading Performance',
                data: data.performance,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'time', time: { unit: 'day' } },
                y: { beginAtZero: true }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTraderAnalytics('some-trader-id');
});
async function fetchNotifications(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/notifications/${userId}`);
        const notifications = await response.json();
        displayNotifications(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
    }
}

function displayNotifications(notifications) {
    const notificationsList = document.getElementById('notifications');
    notificationsList.innerHTML = '';
    notifications.forEach(notification => {
        const notificationItem = document.createElement('li');
        notificationItem.textContent = notification.message;
        notificationsList.appendChild(notificationItem);

        if (!notification.read) {
            notificationItem.classList.add('unread');
            notificationItem.addEventListener('click', () => markAsRead(notification._id, notificationItem));
        }
    });
}

async function markAsRead(notificationId, element) {
    try {
        await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        element.classList.remove('unread');
    } catch (err) {
        console.error('Error marking notification as read:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userId = 'some-user-id';
    fetchNotifications(userId);
});

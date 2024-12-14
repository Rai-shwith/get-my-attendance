   // Function to close the server
   const closeServer = async (server) => {
    server.close(() => {
        log(yellow, 'Server stopped gracefully.');
        process.exit(0);
    });
}


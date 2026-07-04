require 'openssl'
require 'socket'

module Mepp
  module Connection

    private
    def request(data)
      socket     = open_socket(@provider[:host], @provider[:port])
      ssl_socket = open_ssl(socket, @provider[:ssl])
      greeting = greeting(ssl_socket)
      log(greeting,0)
      send_data(ssl_socket,login)
      loginanswer = read_data(ssl_socket)
      log(loginanswer,0)
      unless result_code(loginanswer)[:code].eql?('1000')
        log(result_code(loginanswer), 4)
        raise 'Login failed'
      end
      send_data(ssl_socket,data)
      log(data,0)
      answer = read_data(ssl_socket)
      log(answer,0)
      send_data(ssl_socket,logout)
      logoutreply = read_data(ssl_socket)
      log(logoutreply,0)
      close_ssl(ssl_socket)
      close_socket(socket)
      answer.gsub(/\n[\ ]+/,'')
    end

    def open_socketOLD(host, port)
      begin
        @socket = TCPSocket.open(host, port)
      rescue
        sleep 1
        log('retry to open socket',0)
        @socket = TCPSocket.open(host, port)
      end
      log('open_socket',0)
      if @socket 
        return @socket
      else
        raise 'Connect failed'
      end
    end

    def open_socket(host, port, timeout = 1)
      retry_attempts = 2

      # Convert the passed host into structures the non-blocking calls
      # can deal with
      begin
        addr = Socket.getaddrinfo(host, nil)
      rescue
        if retry_attempts > 0
          retry_attempts -= 1
          sleep 1
          retry
        end
      end
      sockaddr = Socket.pack_sockaddr_in(port, addr[0][3])

      Socket.new(Socket.const_get(addr[0][0]), Socket::SOCK_STREAM, 0).tap do |socket|
        socket.setsockopt(Socket::IPPROTO_TCP, Socket::TCP_NODELAY, 1)

        begin
          # Initiate the socket connection in the background. If it doesn't fail 
          # immediatelyit will raise an IO::WaitWritable (Errno::EINPROGRESS) 
          # indicating the connection is in progress.
          socket.connect_nonblock(sockaddr)

        rescue IO::WaitWritable
          # IO.select will block until the socket is writable or the timeout
          # is exceeded - whichever comes first.
          if IO.select(nil, [socket], nil, timeout)
            begin
              # Verify there is now a good connection
              socket.connect_nonblock(sockaddr)
            rescue Errno::EISCONN
              # Good news everybody, the socket is connected!
              return socket
            rescue
              socket.close
              raise
            end
          else
            # IO.select returns nil when the socket is not ready before timeout 
            # seconds have elapsed
            socket.close
            raise "Connection timeout"
          end
        end
      end
    end

    def close_socket(socket)
      log('close_socket',0)
      socket.close
    end

    def open_ssl(socket, ssl)
      s_cont = OpenSSL::SSL::SSLContext.new
      s_cont.ciphers = ssl[:ciphers] if ssl[:ciphers]
      unless ssl[:certificate_path].empty?
        s_cont.cert = OpenSSL::X509::Certificate.new(File.open(ssl[:certificate_path]))
        s_cont.key = OpenSSL::PKey::RSA.new(File.open(ssl[:key_path]))
      end
      #ssl_context.ssl_version = :SSLv23
      s_sock = OpenSSL::SSL::SSLSocket.new(socket, s_cont)
      s_sock.sync_close = true
      s_sock.connect
      log('open_ssl_socket',0)
      s_sock
    end

    def send_data(ssl_socket,data)
      ssl_socket.syswrite(([(4 + data.bytes.length)].pack('N')))
      ssl_socket.syswrite(data)
      log('send_data',0)
    end

    def read_data(ssl_socket)
      readbytes = ssl_socket.sysread(4)
      msglength = readbytes.unpack('N*')
      ssl_socket.sysread(msglength[0] + 4)
    end

    def close_ssl(ssl_socket)
      log('close_ssl_socket',0)
      ssl_socket.close
    end

  end
end
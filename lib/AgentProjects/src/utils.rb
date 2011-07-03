
class Utils
  def self.gaussian_prob(x, mean, std_dev)
    coeff = 1 / Math::sqrt(2 * Math::PI * (std_dev ** 2))
    num = (x - mean) ** 2
    denom = 2 * (std_dev ** 2)
    div = -(num / denom.to_f)
    y = Math::E ** div
    z = coeff  * y
    z
  end



  def self.gaussian_rand(mean = 0, std_dev = 1)
    x1 = 0; x2 = 0; w = 0; y1 = 0; y2 = 0
    begin
      x1 = 2 * rand() - 1
      x2 = 2 * rand() - 1
      w = x1 * x1 + x2 * x2
    end while w >= 1.0 or w == 0
    

    w = Math::sqrt((-2.0 * Math::log(w)) / w)
    y1 = x1 * w;
    y2 = x2 * w;
    y2 * std_dev + mean
  end

  # http://azzalini.stat.unipd.it/SN/stephen_gersuk.excel
  # fAlpha = slant/shape characteristic 
  # Location =
  def self.skew_rand(alpha, location = 0, scale = 1)
#    ' shg 2008-0919
#    ' http://azzalini.stat.unipd.it/SN/faq.html         (algorithm)
#    ' http://azzalini.stat.unipd.it/SN/Intro/intro.html (intro)
#    ' http://azzalini.stat.unipd.it/SN/plot-SN1.html    (density function plotting)
#
#    ' Returns a random variable with skewed distribution
#    '       fAlpha      = skew or 'shape'
#    '       fLocation   = location
#    '       fScale > 0  = scale
    sigma = 0; u0 = 0; u1 = 0; v = 0
    sigma = alpha / Math::sqrt(1 + alpha ** 2)

    u0 = gaussian_rand
    v = gaussian_rand
    u1 = sigma * u0 + Math::sqrt(1 - sigma * sigma) * v

    (u0 >= 0 ? u1 : -u1) * scale + location
  end

#    ' http://azzalini.stat.unipd.it/SN/faq-r.html         (algorithm)
#    ' http://azzalini.stat.unipd.it/SN/Intro/intro.html (intro)
#    ' http://azzalini.stat.unipd.it/SN/plot-SN1.html    (density function plotting)
  def self.location_and_scale_from_mean_std_dev_and_scale(mean, std_dev, alpha)
    var = std_dev ** 2
    scale = Math::sqrt(var / (1 - 2 * alpha ** 2 / Math::PI))
    location = mean - scale * Math::sqrt(2 / Math::PI) * alpha
    return location, scale 
  end


  # http://en.wikipedia.org/wiki/Log-normal_distribution#Generating_log-normally-distributed_random_variates
  def self.lognormal_rand(mean = 0, std_dev = 1)
#    n = gaussian_rand(mean, std_dev)
    n = gaussian_rand
    x = Math::E ** (mean + std_dev * n)
    x
  end


  def self.poissonian_rand(lam = 1, fac = 1)
    l = Math::exp(-lam) * fac
    k = 0
    p = fac
    begin
      k = k + 1
      p = p * rand()
      puts p
    end while p >= fac
    return k - 1 
  end

  def self.pr(lam = 1, fac = 1)
    l = Math::exp(-lam)
    k = 0
    p = 1
    begin
      k = k + 1
      p = p * rand()
      puts p
    end while p >= l
    return k - 1
  end

end

def self.poissonian_rand2(m)
    unif_save = -1;
    z = m;
#    z *= unif_save < 0 ? ran_unif(0.0, 1.0) : unif_save;
#    for (n = 0; z >= 1.0; n += 1)
#          z *= ran_unif(0.0, 1.0);
#    unif_save = z;
#    return n;

end

#/* Return a Poisson random variable with mean = variance = log(m) */
#int ran_poisson(double m)
#{
#      static double unif_save = -1;
#      double   z;
#      int      n;
#
#      z = m;
#      z *= unif_save < 0 ? ran_unif(0.0, 1.0) : unif_save;
#      for (n = 0; z >= 1.0; n += 1)
#            z *= ran_unif(0.0, 1.0);
#      unif_save = z;
#      return n;
#
#}
